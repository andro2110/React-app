function returnUserId(app, con) {
  app.post("/getUserId", (req, res) => {
    const { index, val } = req.body.narocilo;

    con.query(
      `SELECT n.IDUporabnika, u.Email, u.Ime
                  FROM narocilo n, uporabnik u
                  WHERE n.IDNarocila = ? AND u.IDUporabnika = n.IDUporabnika`,
      index,
      (err, user) => {
        if (err)
          res.json({ success: false, errMessage: "Napaka pri posodabljanju!" });
        else {
          const tmp = user[0];
          req.session.tmpUser = tmp;
          req.session.statusNarocila = val;
          res.redirect("/sendEmail");
        }
      }
    );
  });
}

module.exports = {
  returnUserId,
};
