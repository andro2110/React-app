const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");
// const nodemailer = require("nodemailer");
const app = express();
require("dotenv").config();

const user = require("./services/user");
const loader = require("./services/vrniVzorce");
const logServices = require("./services/userServices/userLog");
const userServ = require("./services/userServices/getUserHelper");
const narociloServices = require("./services/narocilaServices/narocila");
const urejanje = require("./services/adminServices/urejanjeNarocil");
const adminPublishServices = require("./services/adminServices/objavljanjeBlog");
const blogInit = require("./services/blogServices/blogInit");
const likeHandler = require("./services/blogServices/handleLikes");
const blogQueryHandler = require("./services/blogServices/blogQueries");
const emailServices = require("./services/mailServices/mails");

app.use(
  cors({
    origin: [`${process.env.CORS_ORIGIN}`], //http://ip.ip.ip.ip:3000
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(fileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 30 * 24 * 60 * 60 * 1000, //izbrise se po 24 urah
    },
  })
);

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_DB,
});

loader.loadPatterns(app, con);

//NAROCILA STUFF\\
narociloServices.posljiNarocilo(app, con);

app.post("/upload", (req, res) => {
  //v narocila.js ne dela
  const did = req.body.dodatekId;
  const stSlik = req.body.stSlik;

  if (stSlik > 0) {
    const files = req.files;
    for (let i = 0; i < stSlik; i++) {
      const file = `file${i}`;
      const path = `${process.env.SERVER_ADDRESS}/img/${files[file].name}`;
      const imeSlike = files[file].name;

      files[file].mv(`${__dirname}/public/img/${files[file].name}`, (err) => {
        if (err) {
          return res.json({
            errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
          });
        }
      });

      con.query(
        "INSERT INTO slike (IDDodatka, imeSlike, lokacijaSlike) VALUES (?, ?, ?)",
        [did, imeSlike, path],
        (err) => {
          if (err)
            res.json({
              success: false,
              errMessage: "Napaka pri pošiljanju. Poskusi ponovno",
            });
        }
      );
    }
  }

  res.json({ success: true });
});
/*KONEC NAROCIL*/

blogInit.loadNarocila(app, con);
blogInit.loadSorted(app, con);
blogInit.loadImgs(app, con);

blogQueryHandler.vrniPoDatumu(app, con);
blogQueryHandler.posljiQuery(app, con);

/*ADMIN STUFF */

urejanje.updateStatus(app, con);
urejanje.loadNarocila(app, con);
urejanje.loadSlike(app, con);

adminPublishServices.objaviNarocilo(app, con);
adminPublishServices.sendNarocilo(app);
adminPublishServices.vrniNarocilaPoDatumu(app, con);
adminPublishServices.redirectToObjave(app);

app.post("/vSlikeObjav", (req, res) => {
  //sklepam da ne bo delal
  const nId = req.body.narociloId;
  const stSlik = req.body.stSlik;
  const files = req.files;

  for (let i = 0; i < stSlik; i++) {
    const file = `file${i}`;
    const path = `${process.env.SERVER_ADDRESS}/blogImg/${files[file].name}`;
    const imeSlike = files[file].name;

    files[file].mv(`${__dirname}/public/blogImg/${files[file].name}`, (err) => {
      if (err) {
        res.json({ errMessage: "Napaka pri pošiljanju slik." });
      }
    });

    con.query(
      "INSERT INTO blogSlike (narociloBlogID, imeSlike, lokacijaSlike) VALUES (?, ?, ?)",
      [nId, imeSlike, path],
      (err) => {
        if (err) res.json({ errMessage: "Napaka pri pošiljanju slik." });
      }
    );
  }
  res.json({ success: true });
});

//konec admin stuff

likeHandler.getLikedPosts(app, con);
likeHandler.likePost(app, con);
likeHandler.dislikePost(app, con);

user.sendUser(app);
user.getLikedPosts(app, con);

logServices.logout(app);
logServices.checkIfLoggedIn(app);
logServices.authUser(app);
logServices.login(app, con);
logServices.register(app, con);

userServ.returnUserId(app, con);

app.get("/sendEmail", (req, res) => {
  if (req.session.tmpUser) {
    const user = req.session.tmpUser;
    const status = req.session.statusNarocila;

    const emailOptions = emailServices.setEmail(user, status);
    emailServices.sendMail(emailOptions);
  }
});

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
