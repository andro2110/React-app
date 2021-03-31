function addPattern(app, con) {
  app.post("/addPattern", (req, res) => {
    const { vzorec: imeVzorca } = req.body;

    con.query("INSERT INTO vzorci(ime) VALUES (?)", [imeVzorca], (err) => {
      if (err) {
        res.json({ success: false, message: "Napaka pri dodajanju vzorca" });
      } else {
        res.json({ success: true, message: "Uspešno dodan vzorec" });
      }
    });
  });
}

module.exports = { addPattern };
