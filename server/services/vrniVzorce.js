function loadPatterns(app, con) {
  app.get("/vzorci", (req, res) => {
    con.query("SELECT * FROM vzorci", (err, podatki) => {
      if (err) res.json({ errMessage: "Napaka pri pridobivanju vzorcev." });
      else res.json({ data: podatki });
    });
  });
}

module.exports = { loadPatterns };
