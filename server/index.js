const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const fileUpload = require("express-fileupload");
const app = express();
const salt = 10;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userID",
    secret: "test",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24, //izbrise se po 24 urah
    },
  })
);

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "baza",
});

const verifyJWT = (req, res, next) => {
  const token = req.body.headers["x-access-token"];

  if (!token) {
    res.send("potrebujem zeton");
  } else {
    jwt.verify(token, "sladkaSol", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Napaka pri avtentikaciji" });
      } else {
        req.userId = decoded.id; //shrani zeton
        next();
      }
    });
  }
};

app.post("/register", (req, res) => {
  const {
    ime,
    priimek,
    email,
    geslo,
    hisnaSt,
    postSt,
    status,
  } = req.body.novRacun;

  bcrypt.hash(geslo, salt, (err, enkrGeslo) => {
    if (err) {
      res.send(err);
    }

    con.query(
      "INSERT INTO uporabnik (Ime, Priimek, Email, Geslo, HisnaSTUlica, PostnaStevilka, Status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [ime, priimek, email, enkrGeslo, hisnaSt, Number(postSt), status],
      (err) => {
        if (err) res.send(err);
      }
    );
  });
});

app.get("/vzorci", (req, res) => {
  con.query("SELECT * FROM Vzorci", (err, podatki) => {
    if (err) res.send(err);
    else return res.json({ data: podatki });
  });
});

//FULL NAROCILO QUERY
app.post("/narocila", (req, res) => {
  const { model, stevilka, opis, barva } = req.body.narocilo;

  const { nacinPlacila, status, vzorec } = req.body.dodatki;
  const token = req.body.token;

  const date = new Date();
  const userId = jwt.decode(token).id; //dekodira token in shrani id logged in userja

  con.query(
    //vstavi v artikel
    "INSERT INTO artikel (model, stevilka) VALUES (?, ?)",
    [model, stevilka],
    (err) => {
      if (err) {
        res.send(err);
      }
    }
  );

  con.query(
    //dobi idartikla poslanega narocila
    "SELECT IDArtikla FROM artikel ORDER BY IDArtikla DESC LIMIT 1",
    (err, podatki) => {
      if (err) {
        res.send(err);
      }

      const artikelId = podatki[0].IDArtikla;
      con.query(
        //vstavi podatke v narocila
        "INSERT INTO narocilo (IDUporabnika, IDArtikla, Datum, nacinPlacila, opis, Status) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, artikelId, date, nacinPlacila, opis, status],
        (err) => {
          if (err) {
            res.send(err);
          }
        }
      );

      con.query(
        //vstavi podatke v dodatki
        "INSERT INTO Dodatki (IDArtikla, Idvzorca, barva) VALUES (?, ?, ?)",
        [artikelId, vzorec, barva],
        (err) => {
          if (err) {
            res.send(err);
          } else {
            // res.json({ koncano: true });
          }
        }
      );

      con.query(
        //dobi iddodatka, da lahko poslje sliko v PB (POPRAVI...vec slik more it not)
        "SELECT IDDodatka FROM Dodatki ORDER BY IDDodatka DESC LIMIT 1",
        (err, podatki) => {
          if (err) {
            res.json({ err, success: false });
          } else {
            const dodatekId = podatki[0].IDDodatka;
            res.json({ dodatekId, success: true });
          }
        }
      );
    }
  );
});
app.use(fileUpload());
app.post("/upload", (req, res) => {
  const file = req.files.file;
  const did = req.body.dodatekId;

  const path = `http://localhost:4000/img/${req.files.file.name}`;
  const imeSlike = req.files.file.name;

  file.mv(`${__dirname}/public/img/${file.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
  });

  con.query(
    "INSERT INTO slike (IDDodatka, imeSlike, lokacijaSlike) VALUES (?, ?, ?)",
    [did, imeSlike, path],
    (err) => {
      if (err) res.send(err);
    }
  );
});

app.post("/authUser", verifyJWT, (req, res) => {
  res.json({ message: "Racun je avtenticirann" });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", (req, res) => {
  const { email, geslo } = req.body.racun;

  con.query(
    "SELECT * FROM uporabnik WHERE Email = ?",
    email,
    (err, podatki) => {
      if (err) {
        res.send(err);
      }

      if (podatki.length > 0) {
        bcrypt.compare(geslo, podatki[0].Geslo, (error, response) => {
          if (response) {
            const id = podatki[0].IDUporabnika;
            const token = jwt.sign({ id }, "sladkaSol", {
              expiresIn: 300, //spremeni na dejanski cas sessiona preden te log outa
            });
            req.session.user = podatki;

            res.json({ auth: true, token: token, podatki });
          } else {
            res.json({ auth: false, message: "Napacna kombinacija" });
          }
        });
      } else {
        res.json({ auth: false, message: "Racun ne obstaja" });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  // req.session.destroy();
  return res //zbrise cookie da se lohk logoutas
    .cookie("userID", "deleted", {
      maxAge: 0,
      expires: "Thu, 01 Jan 1970 00:00:00 GMT",
    })
    .end();
});

app.post("/adminNarocila", (req, res) => {
  con.query(
    `SELECT n.IDNarocila, n.nacinPlacila, n.Opis, n.Status, a.model, a.Stevilka, d.barva 
    FROM Narocilo n, Artikel a, Dodatki d
    WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla `,
    (err, narocila) => {
      if (err) res.json({ err: err });

      res.json({ narocila });
    }
  );
});

app.post("/vrniNarocila", (req, res) => {
  const model = req.body.iskanModel.toLowerCase();
  const opis = req.body.iskanOpis.toLowerCase();

  con.query(
    `SELECT n.IDNarocila, nb.opis, a.model, n.Datum, v.Ime AS vzorec, s.lokacijaSlike
      FROM Narocilo n, Artikel a, Dodatki d, Vzorci v, blogSlike s, narociloNaBlogu nb
      WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND v.IDVzorca = d.IDVzorca AND 
      nb.IDNarocila = n.IDNarocila AND nb.ID = s.narociloBlogID
      AND LOWER(a.model) LIKE '%${model}%' AND LOWER(nb.opis) LIKE '%${opis}%'`,
    (err, narocila) => {
      if (err) res.send(err);
      else res.json({ narocila });
    }
  );
});

app.get("/narocila", (req, res) => {
  con.query("SELECT * FROM Vzorci", (err, podatki) => {
    if (err) res.send(err);
    else return res.json({ data: podatki });
  });
});
/*KONEC NAROCIL*/

app.get("/blog", (req, res) => {
  con.query(
    `SELECT n.IDNarocila, nb.opis, a.model, nb.datumObjave, v.Ime AS vzorec, s.lokacijaSlike
      FROM Narocilo n, Artikel a, Dodatki d, Vzorci v, blogSlike s, narociloNaBlogu nb
      WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND v.IDVzorca = d.IDVzorca AND 
      nb.IDNarocila = n.IDNarocila AND nb.ID = s.narociloBlogID`,
    (err, narocila) => {
      if (err) res.send(err);

      res.json({ narocila });
    }
  );
});

app.post("/vrniDatum", (req, res) => {
  const nacin = req.body.tmpNacin;

  con.query(
    `SELECT n.IDNarocila, nb.opis, a.model, nb.datumObjave, v.Ime AS vzorec, s.lokacijaSlike
    FROM Narocilo n, Artikel a, Dodatki d, Vzorci v, blogSlike s, narociloNaBlogu nb
    WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND v.IDVzorca = d.IDVzorca AND 
    nb.IDNarocila = n.IDNarocila AND nb.ID = s.narociloBlogID
      ORDER BY nb.datumObjave ${nacin}`,
    (err, narocila) => {
      if (err) res.send(err);
      else res.json({ narocila });
    }
  );
});

/*ADMIN STUFF */
app.post("/updateNarocila", (req, res) => {
  const { val, index } = req.body.narocilo;
  con.query(
    `UPDATE Narocilo SET Status = "${val}" WHERE IDNarocila = ${index}`,
    (err) => {
      if (err)
        res.json({
          success: false,
          message: "Napaka pri posodabljanju statusa",
        });
      else res.json({ success: true, message: "Status uspesno posodobljen" });
    }
  );
});

app.post("/test", (req, res) => {
  const narocilo = req.body.narocilo;
  req.session.narocilo = narocilo;
  res.redirect("/adminBlog");
});

app.get("/adminBlog", (req, res) => {
  const narocilo = req.session.narocilo;
  res.json({ narocilo });
  req.session.narocilo = "";
});

app.post("/vTabeloObjav", (req, res) => {
  const { opis, IDNarocila } = req.body;
  const date = new Date();

  con.query(
    "INSERT INTO narociloNaBlogu (IDNarocila, opis, datumObjave) VALUES (?, ?, ?)",
    [IDNarocila, opis, date],
    (err) => {
      if (err) res.json({ success: false, err: err });
    }
  );

  con.query(
    //dobi iddodatka, da lahko poslje sliko v PB (POPRAVI...vec slik more it not)
    "SELECT ID FROM narociloNaBlogu ORDER BY ID DESC LIMIT 1",
    (err, podatki) => {
      if (err) {
        res.json({ success: false, err });
      } else {
        const narociloBlogId = podatki[0].ID;
        res.json({ narociloBlogId, success: true });
      }
    }
  );
});

app.post("/vSlikeObjav", (req, res) => {
  const file = req.files.slika;
  const nid = req.body.narociloId;

  const path = `http://localhost:4000/blogImg/${file.name}`;
  const imeSlike = file.name;

  file.mv(`${__dirname}/public/blogImg/${file.name}`, (err) => {
    if (err) res.send(err);
  });

  con.query(
    "INSERT INTO blogSlike (imeSlike, lokacijaSlike, narociloBlogID) VALUES (?, ?, ?)",
    [imeSlike, path, nid],
    (err) => {
      if (err) res.json({ err, success: false });
      else res.json({ success: true });
    }
  );
});

app.post("/vrniNarocilaDatum", (req, res) => {
  const nacin = req.body.tmpNacin;
  // `SELECT n.IDNarocila, n.opis, a.model, v.Ime AS vzorec, s.lokacijaSlike
  con.query(
    `SELECT n.IDNarocila, a.Stevilka, n.Opis, n.Status, a.model, v.Ime AS vzorec, s.lokacijaSlike, n.nacinPlacila, d.barva
    FROM narocilo n, artikel a, vzorci v, slike s, dodatki d
    WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca AND d.IDDodatka = s.IDDodatka
    ORDER BY n.datum ${nacin}`,
    (err, narocila) => {
      // console.log(narocila);
      if (err) res.send(err);
      else res.json({ narocila });
    }
  );
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
