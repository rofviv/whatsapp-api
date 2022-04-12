const router = require("express").Router();
const fs = require("fs");
const { generateClientWhatsapp } = require('./utils');

router.get("/checkauth", async (req, res) => {
  client
    .getState()
    .then((data) => {
      console.log(data);
      // res.send(data);
      res.send({ status: "CONNECTED", message: data });
    })
    .catch((err) => {
      if (err) {
        res.send("DISCONNECTED");
      }
    });
});

router.get("/getqr", async (req, res) => {
  client
    .getState()
    .then((data) => {
      if (data) {
        res.write("<html><body><h2>Already Authenticated</h2></body></html>");
        res.end();
      } else sendQr(res);
    })
    .catch(() => sendQr(res));
});

function sendQr(res) {
  fs.readFile("components/last.qr", (err, last_qr) => {
    console.log("last_qr", last_qr);
    if (!err && last_qr) {
      var page = `
                    <html>
                        <body>
                            <script type="module">
                            </script>
                            <div id="qrcode"></div>
                            <script type="module">
                                import QrCreator from "https://cdn.jsdelivr.net/npm/qr-creator/dist/qr-creator.es6.min.js";
                                let container = document.getElementById("qrcode");
                                QrCreator.render({
                                    text: "${last_qr}",
                                    radius: 0.5, // 0.0 to 0.5
                                    ecLevel: "H", // L, M, Q, H
                                    fill: "#536DFE", // foreground color
                                    background: null, // color or null for transparent
                                    size: 256, // in pixels
                                }, container);
                            </script>
                        </body>
                    </html>
                `;
      res.write(page);
      res.end();
    }
  });
}

router.get("/clear_session", async (req, res) => {
  try {
    const path = require("path");
    const folderPath = path.join(__dirname, "..", ".wwebjs_auth");
    if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true });
    //Reset client
    global.client.removeAllListeners();
    global.client = generateClientWhatsapp();
    global.authed = false;
    client.initialize();
    res.json({ status: 200, message: "OK" });
  } catch (error) {
    console.log("errror clear session", error);
    res.status(401).json({ status: 401, message: "Error" });
  }
});

module.exports = router;
