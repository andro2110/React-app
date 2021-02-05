const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "baza",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/insert", (req, res) => {
  const artikel = req.body.artikel;
  console.log(artikel);

  const insert = "INSERT INTO artikel (Model) VALUES (?);";
  db.query(insert, [artikel], (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(4000, () => {
  console.log("listening on 4000");
});
