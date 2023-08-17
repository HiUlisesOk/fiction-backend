/**
 * @swagger
 * tags:
 *   name: Roleplay Sheets
 *   description: Operaciones relacionadas con las fichas de rol (Roleplay Sheets) de los personajes.
 */

const { Router } = require("express");
const sheetRouter = Router();
const { authenticateToken, userRestrict } = require('../../utils/Auth');
const {
	getAllSheets, getSheetsById, createSheets, updateSheet, deleteSheet, getSheetByCharId
} = require("../../controllers/CharacterControllers/SheetsControllers");

/**
 * @swagger
 * /get-all-sheets:
 *   get:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Obtener todos las fichas de rol
 *     description: Obtiene una lista de todas las fichas de rol
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
sheetRouter.get("/get-all-sheets", authenticateToken, async (req, res) => {
	try {
		const sheets = await getAllSheets();
		res.status(200).send(sheets);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-sheet-info/{id}:
 *   get:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Obtener información de una ficha de rol por ID
 *     description: Obtiene la información de una ficha de rol específico por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la ficha de rol a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
sheetRouter.get("/get-sheet-info/:id", authenticateToken, async (req, res) => {
	try {
		const ID = req.params.id;
		const sheetInfo = await getSheetsById(ID);
		res.status(200).send(sheetInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-sheet-getSheetByCharId/{id}:
 *   get:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Obtener información de una ficha de rol por ID del personaje
 *     description: Obtiene la información de una ficha de rol específico por id del personaje
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la ficha de rol a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
sheetRouter.get("/get-sheet-getSheetByCharId/:id", authenticateToken, async (req, res) => {
	try {
		const ID = req.params.id;
		const sheetInfo = await getSheetByCharId(ID);
		res.status(200).send(sheetInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /create-sheet:
 *   post:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Crear una nueva ficha de rol
 *     description: Crea una nueva ficha de rol con los datos proporcionados
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
 *               realAge:
 *                 type: number
 *               fisicalAge:
 *                 type: number
 *               sexOrientation:
 *                 type: string
 *               ocInfo:
 *                 type: string
 *               reputation:
 *                 type: number
 *               isDead:
 *                 type: boolean
 *               theme:
 *                 type: string
 *               history:
 *                 type: string
 *               extraData:
 *                 type: string
 *               fisicalDesc:
 *                 type: string
 *               Psicology:
 *                 type: string
 *               CharacterID:
 *                 type: integer
 *             required:
 *               - userID
 *               - realAge
 *               - fisicalAge
 *               - sexOrientation
 *               - ocInfo
 *               - reputation
 *               - isDead
 *               - theme
 *               - history
 *               - extraData
 *               - fisicalDesc
 *               - Psicology
 *               - CharacterID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
sheetRouter.post("/create-sheet", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			realAge,
			fisicalAge,
			sexOrientation,
			ocInfo,
			reputation,
			isDead,
			theme,
			history,
			extraData,
			fisicalDesc,
			Psicology,
			CharacterID,
		} = req.body;

		const sheet = await createSheets(
			realAge,
			fisicalAge,
			sexOrientation,
			ocInfo,
			reputation,
			isDead,
			theme,
			history,
			extraData,
			fisicalDesc,
			Psicology,
			CharacterID,
		);
		res.status(200).send(sheet);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-sheet:
 *   put:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Actualizar una ficha de rol existente
 *     description: Actualiza los datos de una ficha de rol existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: number
 *               ID:
 *                 type: number
 *               realAge:
 *                 type: number
 *               fisicalAge:
 *                 type: number
 *               sexOrientation:
 *                 type: string
 *               ocInfo:
 *                 type: string
 *               reputation:
 *                 type: number
 *               isDead:
 *                 type: boolean
 *               theme:
 *                 type: string
 *               history:
 *                 type: string
 *               extraData:
 *                 type: string
 *               fisicalDesc:
 *                 type: string
 *               Psicology:
 *                 type: string
 *             required:
 *               - userID
 *               - ID
 *               - realAge
 *               - fisicalAge
 *               - sexOrientation
 *               - ocInfo
 *               - reputation
 *               - isDead
 *               - theme
 *               - history
 *               - extraData
 *               - fisicalDesc
 *               - Psicology
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
sheetRouter.put("/update-sheet", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			ID,
			realAge,
			fisicalAge,
			sexOrientation,
			ocInfo,
			reputation,
			isDead,
			theme,
			history,
			extraData,
			fisicalDesc,
			Psicology,
		} = req.body;

		const sheet = await updateSheet(
			ID,
			realAge,
			fisicalAge,
			sexOrientation,
			ocInfo,
			reputation,
			isDead,
			theme,
			history,
			extraData,
			fisicalDesc,
			Psicology,
		);
		res.status(200).send(sheet);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-sheet:
 *   delete:
 *     tags:
 *       - Roleplay Sheets
 *     summary: Eliminar una ficha de rol existente
 *     description: Elimina una ficha de rol existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userID
 *         description: ID de la ficha de rol a eliminar
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: ID
 *         description: ID de la ficha de rol a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
sheetRouter.delete("/delete-sheet", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { ID } = req.query;

		const sheet = await deleteSheet(ID);
		res.status(200).send(sheet);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = sheetRouter;