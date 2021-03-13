function sendNarocilo(app) {
  app.get("/adminBlog", (req, res) => {
    const narocilo = req.session.narocilo;
    res.json({ narocilo });
    req.session.narocilo = "";
  });
}

function objaviNarocilo(app, con) {
  app.post("/vTabeloObjav", (req, res) => {
    const { opis, IDNarocila } = req.body;
    const date = new Date();
    const vsecki = 0;

    con.query(
      "INSERT INTO narocilonablogu (IDNarocila, opis, datumObjave, vsecki) VALUES (?, ?, ?, ?)",
      [IDNarocila, opis, date, vsecki],
      (err) => {
        if (err)
          res.json({ success: false, errMessage: "Napaka pri pošiljanju." });
      }
    );

    con.query(
      "SELECT ID FROM narocilonablogu ORDER BY ID DESC LIMIT 1",
      (err, podatki) => {
        if (err) {
          res.json({ success: false, errMessage: "Napaka pri pošiljanju." });
        } else {
          const narociloBlogId = podatki[0].ID;
          res.json({ narociloBlogId, success: true });
        }
      }
    );
  });
}

function vrniNarocilaPoDatumu(app, con) {
  app.post("/vrniNarocilaDatum", (req, res) => {
    const nacin = req.body.tmpNacin;
    con.query(
      `SELECT n.IDNarocila, n.datum, a.stevilka, n.opis, n.status, a.model, v.ime AS vzorec, n.nacinPlacila, d.IDDodatka
          FROM narocilo n, artikel a, vzorci v, dodatki d
          WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca
          ORDER BY n.datum ${nacin}`,
      (err, narocila) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju naročil." });
        else res.json({ narocila, errMessage: "" });
      }
    );
  });
}

function redirectToObjave(app) {
  app.post("/redirect", (req, res) => {
    const narocilo = req.body.narocilo;
    req.session.narocilo = narocilo;
    res.redirect("/adminBlog");
  });
}

module.exports = {
  redirectToObjave,
  sendNarocilo,
  objaviNarocilo,
  vrniNarocilaPoDatumu,
};
