const express = require("express");
require('express-async-errors');
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const shelljs = require("shelljs");
const cors = require('cors')
const path = require('path');

const config = require("./config.json");
const { generateClientWhatsapp } = require('./components/utils');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// const folderPath = path.join(__dirname, ".wwebjs_auth");
// if (fs.existsSync(folderPath)) fs.rmSync(folderPath, { recursive: true });

process.title = "whatsapp-node-api";
global.client = generateClientWhatsapp();
global.authed = false;


const port = process.env.PORT || config.port;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//Set Request Size Limit 50 MB
app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  client.on("ready", () => {
    console.log("Client is ready!");
  });
  client.on("disconnected", () => {
    console.log("disconnected");
  });
});

client.initialize();

// const chatRoute = require("./components/chatting");
const groupRoute = require("./components/group");
const contactRoute = require("./components/contact");
const otpRoute = require('./components/otp');

const authRoute = require("./components/auth");
const messageRoute = require('./components/message');
const { handleError } = require("./middlewares/handle-error.middlewares");

app.use(function (req, res, next) {
  console.log(req.method + " : " + req.path);
  next();
});
// app.use("/chat", chatRoute);
app.use("/group", groupRoute);
app.use("/auth", authRoute);
app.use("/contact", contactRoute);

app.use('/otp', otpRoute);
app.use('/message', messageRoute);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//Manejar Error
app.use(handleError);

server.listen(port, () => {
  console.log("Server Running Live on Port : " + port);
});
