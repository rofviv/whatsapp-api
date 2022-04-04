const router = require('express').Router();
const fs = require('fs');

router.post('/send', async (req, res) => {
  let phone = req.body.phone;
  let app = req.body.app;
  let lang = req.body.lang || "en";

  if (phone == undefined || app == undefined) {
    res.send({ status: "error", message: "Missing params" });
  } else {
    client.getState().then((data) => {
      console.log(data)
      client.isRegisteredUser(`${phone}@c.us`).then((exists) => {
        if (exists) {
          let message = " Es tu código de verificación de *" + app + "*";
          if (lang == "en") {
            message = " It's your *" + app + "* verification code";
          }
          max = 999999;
          min = 100000;
          otp = Math.floor(Math.random() * (max - min) + min);
          message = "*" + otp + "*" + message;
          client.sendMessage(phone + '@c.us', message).then((response) => {
            if (response.id.fromMe) {
              res.send({ status: 'SUCCESS', message: `Message successfully sent to ${phone}`, otp: otp })
            }
          });
        } else {
          res.send({ status: 'NOT_EXISTS', message: `${phone} is not a whatsapp user` });
        }
      });
    }).catch((err) => {
      if (err) {
        res.send({ status: "DISCONNECTED", message: err });
        try {
          fs.unlinkSync('../session.json')
        } catch (err) {
          console.log(err)
        }
      }
    })
  }
});


module.exports = router;