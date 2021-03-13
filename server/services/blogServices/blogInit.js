function loadNarocila(app, con) {
  app.get("/blog", (req, res) => {
    con.query(
      `SELECT n.IDNarocila, nb.datumObjave, nb.vsecki, a.model, nb.ID AS narociloBlogId, nb.opis, v.ime AS vzorec
          FROM narocilo n, narocilonablogu nb, artikel a, dodatki d, vzorci v
          WHERE nb.IDNarocila = n.IDNarocila AND n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca`,
      (err, narocila) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju naročil." });
        else res.json({ narocila, errMessage: "" });
      }
    );
  });
}

function loadSorted(app, con) {
  app.post("/listGroup", (req, res) => {
    const { pattern } = req.body;
    if (pattern.IDVzorca !== 5) {
      con.query(
        `SELECT a.model, d.barva, v.ime AS vzorec, nb.opis, nb.datumObjave, nb.ID AS narociloBlogId, nb.vsecki
            FROM narocilo n, artikel a, dodatki d, vzorci v, narocilonablogu nb
            WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca AND nb.IDNarocila = n.IDNarocila
            AND v.IDVzorca = ?`,
        [pattern.IDVzorca],
        (err, narocila) => {
          if (err)
            res.send({
              errMessage: "Napaka pri pridobivanju naročil",
            });
          else res.json({ narocila });
        }
      );
    } else {
      con.query(
        `SELECT a.model, d.barva, v.ime AS vzorec, nb.opis, nb.datumObjave, nb.ID AS narociloBlogId, nb.vsecki
            FROM narocilo n, artikel a, dodatki d, vzorci v, narocilonablogu nb
            WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca AND nb.IDNarocila = n.IDNarocila`,
        [pattern.IDVzorca],
        (err, narocila) => {
          if (err)
            res.send({
              errMessage: "Napaka pri pridobivanju naročil",
            });
          else res.json({ narocila });
        }
      );
    }
  });
}

function loadImgs(app, con) {
  app.get("/vrniBlogSlike", (req, res) => {
    con.query(
      `SELECT s.imeSlike, s.lokacijaSlike, s.narociloBlogID AS narociloId
          FROM blogSlike s, narocilonablogu nb
          WHERE s.narociloBlogID = nb.ID`,
      (err, slike) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju slik." });
        else res.json({ slike });
      }
    );
  });
}

module.exports = { loadNarocila, loadSorted, loadImgs };
