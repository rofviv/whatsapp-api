const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const shelljs = require("shelljs");
const cors = require('cors')
const path = require('path');

const config = require("./config.json");
const { Client, LocalAuth } = require("whatsapp-web.js");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

process.title = "whatsapp-node-api";
global.client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

global.authed = false;


const port = process.env.PORT || config.port;

app.use(express.static(path.join(__dirname, 'public')));
//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//socket
io.on('connection', clientSocket => {
  console.log('cliente conectado', clientSocket.id);
  client.removeAllListeners();
  client.on("qr", (qr) => {
    console.log("qr");
    clientSocket.emit('qr', qr);
  });
  client.on("authenticated", () => {
    console.log('authenticated');
    clientSocket.emit('authenticated', true);
  });
  client.on("auth_failure", () => {
    clientSocket.emit('authenticated', false);
    process.exit();
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (config.webhook.enabled) {
    if (msg.hasMedia) {
      const attachmentData = await msg.downloadMedia();
      msg.attachmentData = attachmentData;
    }
    axios.post(config.webhook.path, { msg });
  }
});
client.on("disconnected", () => {
  console.log("disconnected");
});
client.initialize();

// const chatRoute = require("./components/chatting");
// const groupRoute = require("./components/group");
const contactRoute = require("./components/contact");
const otpRoute = require('./components/otp');

const authRoute = require("./components/auth");
const messageRoute = require('./components/message');

app.use(function (req, res, next) {
  console.log(req.method + " : " + req.path);
  next();
});
// app.use("/chat", chatRoute);
// app.use("/group", groupRoute);
app.use("/auth", authRoute);
app.use("/contact", contactRoute);

app.use('/otp', otpRoute);
app.use('/message', messageRoute);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(port, () => {
  console.log("Server Running Live on Port : " + port);
});
