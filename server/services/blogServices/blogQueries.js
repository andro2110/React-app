function posljiQuery(app, con) {
  app.post("/vrniNarocila", (req, res) => {
    //blog
    const model = req.body.iskanModel.toLowerCase();
    const opis = req.body.iskanOpis.toLowerCase();

    con.query(
      `SELECT a.model, d.barva, v.ime AS vzorec, nb.opis, nb.datumObjave, nb.ID AS narociloBlogId, nb.vsecki
            FROM narocilo n, artikel a, dodatki d, vzorci v, narocilonablogu nb
            WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca AND nb.IDNarocila = n.IDNarocila
            AND LOWER(a.model) LIKE '%${model}%' AND LOWER(nb.opis) LIKE '%${opis}%'`,
      (err, narocila) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju naročil." });
        else res.json({ narocila });
      }
    );
  });
}

function vrniPoDatumu(app, con) {
  app.post("/vrniDatum", (req, res) => {
    const nacin = req.body.tmpNacin;

    con.query(
      `SELECT a.model, d.barva, v.ime AS vzorec, nb.opis, nb.datumObjave, nb.ID AS narociloBlogId, nb.vsecki
          FROM narocilo n, artikel a, dodatki d, vzorci v, narocilonablogu nb
          WHERE n.IDArtikla = a.IDArtikla AND d.IDArtikla = a.IDArtikla AND d.IDVzorca = v.IDVzorca AND nb.IDNarocila = n.IDNarocila
          ORDER BY nb.datumObjave ${nacin}`,
      (err, narocila) => {
        if (err) res.json({ errMessage: "Napaka pri pridobivanju naročil." });
        else res.json({ narocila });
      }
    );
  });
}

module.exports = { vrniPoDatumu, posljiQuery };
