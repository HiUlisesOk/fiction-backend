const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { AuthLogin } = require('./controllers/UserControllers/UserControllers.js')
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('../swagger'); // Ajusta la ruta según la ubicación de tu archivo de configuración Swagger

require("dotenv").config();
require("./db.js");

const server = express();
server.name = "API";
server.use(cors({ origin: ["http://localhost:5173", "http://localhost:3011", "http://localhost:3027"], credentials: true }));

const swaggerDocs = swaggerJsdoc(swaggerOptions);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const swaggerPort = 3027; // Cambia el número de puerto según tu preferencia
swaggerUi.setup(swaggerDocs, { swaggerOptions: { url: `http://localhost:${swaggerPort}/swagger.json` } });



//http://localhost:5173
//FRONT=https://roleplay.pages.dev


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




/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operaciones de autenticación
 */

server.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const login = await AuthLogin(email, password)
    const { user, passwordsMatch } = login;
    // console.log('login', passwordsMatch, user)

    if (!passwordsMatch) {
      res.status(401).json({ error: `Credenciales inválidas` });
      return;
    }

    // Generar el token de autenticación
    const token = jwt.sign({ id: user.ID, email }, process.env.secretToken);

    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Authentication
     *     summary: Iniciar sesión
     *     description: Inicia sesión con las credenciales proporcionadas y devuelve un token de autenticación
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *             required:
     *               - email
     *               - password
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *                 user:
     *                   type: object
     *                   properties:
     *                     // Propiedades del usuario
     *                 passwordsMatch:
     *                   type: boolean
     *       401:
     *         description: Credenciales inválidas
     */
    res.json({ message: 'Inicio de sesión exitoso', token, user, passwordsMatch });
    next();
  } catch (error) {
    next(error);
  }
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
