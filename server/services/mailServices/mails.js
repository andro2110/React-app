const nodemailer = require("nodemailer");
require("dotenv").config();

function setEmail(user, status) {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.Email,
    subject: "Status naročila spremenjen!",
    text: `Pozdravljen/a ${user.Ime}!

        Tvoje naročilo ima sedaj status ${status}.

        Hvala za potrpežljivost in lep dan:)`,
  };

  return mailOptions;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, //dej v env
    pass: process.env.EMAIL_PASS,
  },
});

function sendMail(options) {
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Sporocilo uspesno poslano");
    }
  });
}

module.exports = { sendMail, setEmail };
