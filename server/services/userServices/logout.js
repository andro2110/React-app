const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const salt = 10;

const verifyJWT = (req, res, next) => {
  const token = req.body.headers["x-access-token"];

  if (!token) {
    res.send("potrebujem zeton");
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "Napaka pri avtentikaciji" });
      } else {
        req.userId = decoded.id; //shrani zeton
        next();
      }
    });
  }
};

function login(app, con) {
  app.post("/login", (req, res) => {
    const { email, geslo } = req.body.racun;

    con.query(
      "SELECT * FROM uporabnik WHERE email = ?",
      email,
      (err, podatki) => {
        if (err)
          res.json({ errMessage: "Napaka pri prijavi. Poskusi ponovno" });

        if (podatki.length > 0) {
          bcrypt.compare(geslo, podatki[0].Geslo, (error, response) => {
            if (response) {
              const id = podatki[0].IDUporabnika;
              const token = jwt.sign({ id }, process.env.TOKEN_SECRET, {
                expiresIn: 30 * 24 * 60 * 60 * 1000, //spremeni na dejanski cas sessiona preden te log outa
              });
              req.session.user = podatki;

              res.json({ auth: true, token: token, podatki });
            } else {
              res.json({ auth: false, errMessage: "Napačno geslo/email." });
            }
          });
        } else {
          res.json({ auth: false, errMessage: "Račun ne obstaja!" });
        }
      }
    );
  });
}

function logout(app) {
  app.get("/logout", (req, res) => {
    req.session.destroy(); //zbrise session
    // return res //zbrise cookie da se lohk logoutas
    //   .cookie("userID", "deleted", {
    //     maxAge: 0,
    //     expires: "Thu, 01 Jan 1970 00:00:00 GMT",
    //   })
    //   .end();
  });
}

function authUser(app) {
  app.post("/authUser", verifyJWT, (req, res) => {
    res.json({ message: "Prijava uspešna!" });
  });
}

function checkIfLoggedIn(app) {
  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });
}

function register(app, con) {
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

    con.query(
      `SELECT u.IDUporabnika FROM uporabnik u WHERE u.email = '${email}'`,
      (err, upo) => {
        if (upo.length > 0) {
          res.json({ accExists: true });
        } else {
          bcrypt.hash(geslo, salt, (err, enkrGeslo) => {
            if (err) {
              res.send(err);
            }

            con.query(
              "INSERT INTO uporabnik (ime, priimek, email, geslo, hisnaSTUlica, postnaStevilka, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [ime, priimek, email, enkrGeslo, hisnaSt, Number(postSt), status],
              (err) => {
                if (err) {
                  res.json({
                    accExists: false,
                    errMessage: "Napaka pri registraciji. Poskusi ponovno.",
                  });
                } else res.json({ errMessage: "", accExists: false });
              }
            );
          });
        }
      }
    );
  });
}

module.exports = { logout, checkIfLoggedIn, authUser, login, register };
