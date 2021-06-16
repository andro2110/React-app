const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

function posljiNarocilo(app, con) {
  app.post("/narocila", (req, res) => {
    const { model, stevilka, opis, barva } = req.body.narocilo;

    const { nacinPlacila, status, vzorec } = req.body.dodatki;

    const userId = req.session.user[0].IDUporabnika;

    con.query(
      //vstavi v artikel
      "INSERT INTO artikel (model, stevilka) VALUES (?, ?)",
      [model, stevilka],
      (err) => {
        if (err)
          res.json({ errMessage: "Napaka pri pošiljanju. Poskusi ponovno" });
        else {
          con.query(
            //dobi idartikla poslanega narocila
            "SELECT IDArtikla FROM artikel ORDER BY IDArtikla DESC",
            (err, podatki) => {
              if (err)
                res.json({
                  errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
                });

              const artikelId = podatki[0].IDArtikla;
              con.query(
                //vstavi podatke v narocila
                "INSERT INTO narocilo (IDUporabnika, IDArtikla, datum, nacinPlacila, opis, status) VALUES (?, ?, current_date(), ?, ?, ?)",
                [userId, artikelId, nacinPlacila, opis, status],
                (err) => {
                  if (err)
                    res.json({
                      errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
                    });
                }
              );

              con.query(
                //vstavi podatke v dodatki
                "INSERT INTO dodatki (IDArtikla, IDVzorca, barva) VALUES (?, ?, ?)",
                [artikelId, vzorec, barva],
                (err) => {
                  if (err)
                    res.json({
                      errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
                    });

                  else {
                    res.json({success:true});
                  }
                }
              );
            }
          );
        }
      }
    );
  });
}

function posljiSlike(app, con) {
  app.use(fileUpload());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/upload", (req, res) => {
    const did = req.body.dodatekId;
    const stSlik = req.body.stSlik;

    if (stSlik > 0) {
      const files = req.files;
      for (let i = 0; i < stSlik; i++) {
        const file = `file${i}`;
        const path = `${process.env.SERVER_ADDRESS}/img/${files[file].name}`;
        const imeSlike = files[file].name;

        files[file].mv(`${__dirname}/public/img/${files[file].name}`, (err) => {
          if (err) {
            return res.json({
              errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
            });
          }
        });

        con.query(
          "INSERT INTO slike (IDDodatka, imeSlike, lokacijaSlike) VALUES (?, ?, ?)",
          [did, imeSlike, path],
          (err) => {
            if (err)
              res.json({
                success: false,
                errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
              });
          }
        );
      }
    }

    res.json({ success: true });
  });
}

module.exports = { posljiNarocilo, posljiSlike };
