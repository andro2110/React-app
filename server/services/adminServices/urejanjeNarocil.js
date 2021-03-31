const userHelper = require("../userServices/getUserHelper");

function updateStatus(app, con) {
  app.post("/updateNarocila", (req, res) => {
    const { val, index } = req.body.narocilo;
    con.query(
      `UPDATE narocilo SET status = "${val}" WHERE IDNarocila = ${index}`,
      (err) => {
        if (err)
          res.json({
            success: false,
            message: "Napaka pri posodabljanju statusa",
          });
        else {
          res.json({ success: true, message: "Status uspesno posodobljen" });
          // const neki = userHelper.returnUserId(null, con, index);
          // console.log(neki);
        }
      }
    );
  });
}

function loadNarocila(app, con) {
  app.get("/adminNarocila", (req, res) => {
    con.query(
      `SELECT u.priimek, u.hisnaSTUlica, u.PostnaStevilka, n.IDNarocila, n.nacinPlacila, n.opis, n.datum, n.status, a.model, a.stevilka, d.barva, d.IDDodatka
          FROM narocilo n, artikel a, dodatki d, uporabnik u
          WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND u.IDUporabnika = n.IDUporabnika`,
      (err, narocila) => {
        if (err) {
          res.json({
            success: false,
            errMessage: "Napaka pri pridobivanju naročil.",
          });
        } else res.json({ success: true, narocila });
      }
    );
  });
}

function loadSlike(app, con) {
  app.get("/vrniAdminSlike", (req, res) => {
    con.query(
      `SELECT s.imeSlike, s.lokacijaSlike, s.IDDodatka
          FROM slike s`,
      (err, slike) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju slik." });
        else res.json({ slike });
      }
    );
  });
}

module.exports = { updateStatus, loadNarocila, loadSlike };
