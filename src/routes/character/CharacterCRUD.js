/**
 * @swagger
 * tags:
 *   - name: characters
 *     description: Operaciones relacionadas con los personajes
 */

const { Router } = require("express");
const characterRouter = Router();
const { authenticateToken, isAdmin, userRestrict } = require('../../utils/Auth');
const {
	getAllCharacters,
	getCharacterById,
	createCharacter,
	updateCharacter,
	deleteCharacter,
	getCharacterByUserId,
	getCharacterByUsername,
} = require("../../controllers/CharacterControllers/CharacterControllers");

/**
 * @swagger
 * /get-all-characters:
 *   get:
 *     tags:
 *       - characters
 *     summary: Obtener todos los personajes
 *     description: Obtiene una lista de todos los personajes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
characterRouter.get("/get-all-characters", authenticateToken, async (req, res) => {
	try {
		const characterList = await getAllCharacters();
		res.status(200).send(characterList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-character-info:
 *   get:
 *     tags:
 *       - characters
 *     summary: Obtener información de un personaje por ID
 *     description: Obtiene la información de un personaje específico por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID del personaje a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       401:
 *         description: Error de autenticación
 */
characterRouter.get("/get-character-info", authenticateToken, async (req, res) => {
	try {
		const characterID = req.query.id;
		const characterInfo = await getCharacterById(characterID);
		res.status(200).send(characterInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-character-by-username:
 *   get:
 *     tags:
 *       - characters
 *     summary: Obtener información de un personaje por nombre de usuario
 *     description: Obtiene la información de un personaje específico por su nombre de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         description: Nombre de usuario del personaje a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       401:
 *         description: Error de autenticación
 */
characterRouter.get("/get-character-by-username", authenticateToken, async (req, res) => {
	try {
		const username = req.query.username;
		const characterInfo = await getCharacterByUsername(username);
		res.status(200).send(characterInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-character-by-UserID:
 *   get:
 *     tags:
 *       - characters
 *     summary: Obtener información de un personaje por id de usuario
 *     description: Obtiene la información de un personaje específico por el id de un usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: UserID
 *         description: ID de usuario del personaje a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       401:
 *         description: Error de autenticación
 */
characterRouter.get("/get-character-by-UserID", authenticateToken, async (req, res) => {
	try {
		const UserID = req.query.UserID;
		const characterInfo = await getCharacterByUserId(UserID);
		res.status(200).send(characterInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});




/**
 * @swagger
 * /create-character:
 *   post:
 *     tags:
 *       - characters
 *     summary: Crear un nuevo personaje
 *     description: Crea un nuevo personaje con los datos proporcionados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: integer
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               charge:
 *                 type: string
 *               rank:
 *                 type: string
 *              
 *             required:
 *               - userID
 *               - name
 *               - avatar
 *               - charge
 *               - rank
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
characterRouter.post("/create-character", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			userID,
			name,
			avatar,
			charge,
			rank,
		} = req.body;

		const character = await createCharacter(
			userID,
			name,
			avatar,
			charge,
			rank,
		);
		res.status(200).send(character);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * tags:
 *   - name: characters
 *     description: Endpoints related to character management
 * /update-character:
 *   put:
 *     tags:
 *       - characters
 *     summary: Actualizar un personaje existente
 *     description: Actualiza los datos de un personaje existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: integer
 *               ID:
 *                 type: integer
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               charge:
 *                 type: string
 *               rank:
 *                 type: string
 *               guildName:
 *                 type: string
 *               guildID:
 *                 type: integer
 *             example:
 *               userID: "1"
 *               ID: "1"
 *               name: "string"
 *               avatar: "string"
 *               charge: "string"
 *               rank: "string"
 *               guildName: "string"
 *               guildID: 1
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 character:
 *                   $ref: '#/components/schemas/Character'
 *       400:
 *         description: Invalid request error
 */

characterRouter.put("/update-character", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			ID,
			name,
			avatar,
			charge,
			rank,
			guildName,
			guildID
		} = req.body;

		const character = await updateCharacter(
			ID,
			name,
			avatar,
			charge,
			rank,
			guildName,
			guildID
		);
		res.status(200).send(character);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-character:
 *   delete:
 *     tags:
 *       - characters
 *     summary: Eliminar un personaje existente
 *     description: Elimina un personaje existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ID
 *         description: ID del personaje a eliminar
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userID
 *         description: ID del usuario
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */

characterRouter.delete("/delete-character", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { ID } = req.query;

		const character = await deleteCharacter(ID);
		res.status(200).send(character);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = characterRouter;
