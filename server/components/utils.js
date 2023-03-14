const { Client, LocalAuth } = require("whatsapp-web.js");
const path = require("path");

const generateClientWhatsapp = () =>
  new Client({
    authStrategy: new LocalAuth({
      dataPath: path.join(__dirname, "..", ".wwebjs_auth"),
    }),
    puppeteer: { headless: true, args: ["--no-sandbox"] },
  });

module.exports = {
  generateClientWhatsapp,
};
