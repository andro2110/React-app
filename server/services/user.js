function sendUser(app) {
  app.get("/profile", (req, res) => {
    res.json({ user: req.session.user });
  });
}

function getLikedPosts(app, con) {
  app.post("/getLikedProfile", (req, res) => {
    const uid = req.session.user[0].IDUporabnika;

    con.query(
      `SELECT n.IDNarocila, nb.datumObjave, a.model, nb.ID AS narociloBlogId, nb.opis 
      FROM narocilo n, narocilonablogu nb, artikel a, likedPosts lp
      WHERE nb.IDNarocila = n.IDNarocila AND n.IDArtikla = a.IDArtikla AND lp.IDUporabnika = ? AND lp.IDNarocila = nb.ID`,
      [uid],
      (err, narocila) => {
        if (err)
          res.json({
            success: false,
            errMessage: "Napaka pri pridobivanju všečkanih sporočil",
          });
        else res.json({ likedPosts: narocila });
      }
    );
  });
}

module.exports = { sendUser, getLikedPosts };
