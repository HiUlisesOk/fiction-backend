const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { AuthLogin } = require('./controllers/UserControllers.js')
const cors = require('cors');
require("dotenv").config();
require("./db.js");

const server = express();
server.name = "API";

server.use(cors({ origin: 'http://localhost:5173', credentials: true }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));


server.use(
  session({
    secret: process.env.secretToken,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
  })
);

server.use(cookieParser());
server.use(morgan("dev"));

server.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await AuthLogin(email, password)
    const { user, passwordsMatch } = login;
    console.log('login', passwordsMatch, user)

    if (!passwordsMatch) {
      res.status(401).json({ error: `Credenciales inválidas` });
      return;
    }

    // Generar el token de autenticación
    const token = jwt.sign({ email }, process.env.secretToken);


    // // Establecer el token en una cookie
    // res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (error) {
    next(error);
  }
});


server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});






server.use("/", routes);


// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
