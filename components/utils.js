const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

// const generateClientWhatsapp = () => new Client();

// const generateClientWhatsapp = () =>
//   new Client({
//     authStrategy: new LocalAuth({
//       dataPath: path.join(__dirname, "..", ".wwebjs_auth"),
//     }),
//     puppeteer: { headless: true, args: ["--no-sandbox"] },
//   });

// https://github.com/wppconnect-team/wa-version/tree/main/html
const generateClientWhatsapp = () =>
  new Client({
    webVersionCache: {
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2413.51-beta.html",
      type: "remote",
    },
  });
module.exports = {
  generateClientWhatsapp,
};
