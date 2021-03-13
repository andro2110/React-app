function getLikedPosts(app, con) {
  app.post("/getLiked", (req, res) => {
    if (req.body.token) {
      //   const userId = jwt.decode(req.body.token).id;
      const userId = req.session.user[0].IDUporabnika;

      con.query(
        `SELECT IDNarocila FROM likedPosts WHERE IDUporabnika = ?`,
        [userId],
        (err, idNarocila) => {
          if (err)
            res.json({
              success: false,
              errMessage: "Napaka pri pri všečkanju",
            });
          else res.json({ success: true, idNarocila });
        }
      );
    }
  });
}

function likePost(app, con) {
  app.post("/likePost", (req, res) => {
    const { idNarocilaBlog } = req.body;
    const vsecki = req.body.vsecki + 1;
    const uid = req.session.user[0].IDUporabnika;

    if (uid) {
      con.query(
        `UPDATE narocilonablogu 
            SET vsecki = ${vsecki}
            WHERE ID = ${idNarocilaBlog}`,
        (err) => {
          if (err) {
            res.json({ succes: false, errMessage: "Napaka pri všečkanju." });
            console.log(err);
          }
        }
      );

      con.query(
        `INSERT INTO likedPosts (IDUporabnika, IDNarocila) VALUES (?, ?)`,
        [uid, idNarocilaBlog],
        (err) => {
          if (err) {
            res.json({ succes: false, errMessage: "Napaka pri všečkanju." });
            console.log(err);
          } else res.json({ success: true });
        }
      );
    } else {
      res.json({ success: false });
    }
  });
}

function dislikePost(app, con) {
  app.post("/dislikePost", (req, res) => {
    const { idNarocilaBlog } = req.body;
    const vsecki = req.body.vsecki - 1;
    const uid = req.session.user[0].IDUporabnika;

    if (uid) {
      con.query(
        `UPDATE narocilonablogu
            SET vsecki = ${vsecki}
            WHERE ID = ${idNarocilaBlog}`,
        (err) => {
          if (err)
            res.json({ succes: false, errMessage: "Napaka pri všečkanju." });
        }
      );

      con.query(
        `DELETE FROM likedPosts WHERE IDUporabnika = ? AND IDNarocila = ?`,
        [uid, idNarocilaBlog],
        (err) => {
          if (err)
            res.json({ succes: false, errMessage: "Napaka pri všečkanju." });
          else res.json({ success: true });
        }
      );
    }
  });
}

module.exports = { getLikedPosts, likePost, dislikePost };
