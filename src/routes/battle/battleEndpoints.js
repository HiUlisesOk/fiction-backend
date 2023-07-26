/**
 * @swagger
 * tags:
 *   - name: Battle
 *     description: Operaciones relacionadas con los personajes
 */

const { Router } = require("express");
const battleRouter = Router();
const { authenticateToken } = require('../../utils/Auth');
const {
	getAllCharacters,
	getCharacterById,
	createCharacter,
	updateCharacter,
	deletecharacter,
} = require("../../controllers/CharacterControllers");

/**
 * @swagger
 * /start-battle:
 *   get:
 *     tags:
 *       - Battle
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
battleRouter.get("/start-battle", authenticateToken, async (req, res) => {
	try {
		const characterList = await getAllCharacters();
		res.status(200).send(characterList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

// /**
//  * @swagger
//  * /get-character-info/{id}:
//  *   get:
//  *     tags:
//  *       - characters
//  *     summary: Obtener información de un personaje por ID
//  *     description: Obtiene la información de un personaje específico por su ID
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         description: ID del personaje a obtener
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: OK
//  *       401:
//  *         description: Error de autenticación
//  */
// battleRouter.get("/get-character-info/:id", authenticateToken, async (req, res) => {
// 	try {
// 		const characterID = req.params.id;
// 		const characterInfo = await getCharacterById(characterID);
// 		res.status(200).send(characterInfo);
// 	} catch (error) {
// 		res.status(401).send(error.message);
// 	}
// });

// /**
//  * @swagger
//  * /create-character:
//  *   post:
//  *     tags:
//  *       - characters
//  *     summary: Crear un nuevo personaje
//  *     description: Crea un nuevo personaje con los datos proporcionados
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userID:
//  *                 type: integer
//  *               name:
//  *                 type: string
//  *               avatar:
//  *                 type: string
//  *               charge:
//  *                 type: string
//  *               rank:
//  *                 type: string
//  *
//  *             required:
//  *               - userID
//  *               - name
//  *               - avatar
//  *               - charge
//  *               - rank
//  *     responses:
//  *       200:
//  *         description: OK
//  *       400:
//  *         description: Error de solicitud inválida
//  */
// battleRouter.post("/create-character", async (req, res) => {
// 	try {
// 		const {
// 			userID,
// 			name,
// 			avatar,
// 			charge,
// 			rank,
// 		} = req.body;

// 		const character = await createCharacter(
// 			userID,
// 			name,
// 			avatar,
// 			charge,
// 			rank,
// 		);
// 		res.status(200).send(character);
// 	} catch (error) {
// 		res.status(400).send(error.message);
// 	}
// });

// /**
//  * @swagger
//  * /update-character:
//  *   put:
//  *     tags:
//  *       - characters
//  *     summary: Actualizar un personaje existente
//  *     description: Actualiza los datos de un personaje existente
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               ID:
//  *                 type: string
//  *               charactername:
//  *                 type: string
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               birthDate:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               characterScore:
//  *                 type: number
//  *               profilePicture:
//  *                 type: string
//  *             required:
//  *               - ID
//  *               - charactername
//  *               - firstName
//  *               - lastName
//  *               - birthDate
//  *               - email
//  *               - characterScore
//  *               - profilePicture
//  *     responses:
//  *       200:
//  *         description: OK
//  *       400:
//  *         description: Error de solicitud inválida
//  */
// battleRouter.put("/update-character", authenticateToken, async (req, res) => {
// 	try {
// 		const {
// 			ID,
// 			name,
// 			avatar,
// 			charge,
// 			rank,
// 			guildName,
// 			guildID
// 		} = req.body;

// 		const character = await updateCharacter(
// 			ID,
// 			name,
// 			avatar,
// 			charge,
// 			rank,
// 			guildName,
// 			guildID
// 		);
// 		res.status(200).send(character);
// 	} catch (error) {
// 		res.status(400).send(error.message);
// 	}
// });

// /**
//  * @swagger
//  * /delete-character:
//  *   delete:
//  *     tags:
//  *       - characters
//  *     summary: Eliminar un personaje existente
//  *     description: Elimina un personaje existente por su ID
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: ID
//  *         description: ID del personaje a eliminar
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: OK
//  *       400:
//  *         description: Error de solicitud inválida
//  */
// battleRouter.delete("/delete-character", authenticateToken, async (req, res) => {
// 	try {
// 		const { ID } = req.query;

// 		const character = await deletecharacter(ID);
// 		res.status(200).send(character);
// 	} catch (error) {
// 		res.status(400).send(error.message);
// 	}
// });

// module.exports = battleRouter;
