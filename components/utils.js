const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

const generateClientWhatsapp = () =>
  new Client({
    webVersionCache:
    {
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      type: 'remote'
    }
  });
// new Client({
//   authStrategy: new LocalAuth({
//     dataPath: path.join(__dirname, "..", ".wwebjs_auth"),
//   }),
//   puppeteer: { headless: true, args: ["--no-sandbox"] },
// });

module.exports = {
  generateClientWhatsapp,
};
