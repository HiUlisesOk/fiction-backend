/**
 * @swagger
 * tags:
 *   - name: Characters Stats
 *     description: Operaciones relacionadas con los stats de los personajes
 */

const { Router } = require("express");
const statsRouter = Router();
const { authenticateToken } = require('../../utils/Auth');
// Importa los controladores aquí
const {
	getAllStats,
	getStatsById,
	updateStats,
	deleteStats
} = require("../../controllers/CharacterControllers/StatsControllers");

/**
 * @swagger
 * /get-all-stats:
 *   get:
 *     tags:
 *       - Characters Stats
 *     summary: Obtener todos los stats de todos personajes
 *     description: Obtiene una lista de todos los stats de todos los personajes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
statsRouter.get("/get-all-stats", authenticateToken, async (req, res) => {
	try {
		const statsList = await getAllStats();
		res.status(200).send(statsList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-stats-info/{id}:
 *   get:
 *     tags:
 *       - Characters Stats
 *     summary: Obtener información del stat de un personaje por ID de stat
 *     description: Obtiene la información de los stats de un personaje específico por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la tabla de stats del personaje
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
statsRouter.get("/get-stats-info/:id", authenticateToken, async (req, res) => {
	try {
		const ID = req.params.id;
		const statsInfo = await getStatsById(ID);
		res.status(200).send(statsInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /update-stats:
 *   put:
 *     tags:
 *       - Characters Stats
 *     summary: Actualizar los stats de un personaje
 *     description: Actualiza los stats de un personaje existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: string
 *               level:
 *                 type: number
 *               diceName:
 *                 type: string
 *               diceID:
 *                 type: string
 *               diceValue:
 *                 type: number
 *               EXP:
 *                 type: number
 *               HP:
 *                 type: number
 *               STR:
 *                 type: number
 *               AGI:
 *                 type: number
 *               INT:
 *                 type: number
 *               RES:
 *                 type: number
 *               CHARM:
 *                 type: number
 *               WIS:
 *                 type: number
 *             required:
 *               - ID
 *               - level
 *               - diceName
 *               - diceID
 *               - diceValue
 *               - EXP
 *               - HP
 *               - STR
 *               - AGI
 *               - INT
 *               - RES
 *               - CHARM
 *               - WIS
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
statsRouter.put("/update-stats", authenticateToken, async (req, res) => {
	try {
		const {
			ID,
			level,
			diceName,
			diceID,
			diceValue,
			EXP,
			HP,
			STR,
			AGI,
			INT,
			RES,
			CHARM,
			WIS,
		} = req.body;

		const updatedStats = await updateStats(
			ID,
			level,
			diceName,
			diceID,
			diceValue,
			EXP,
			HP,
			STR,
			AGI,
			INT,
			RES,
			CHARM,
			WIS
		);
		res.status(200).send(updatedStats);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-stats/{id}:
 *   delete:
 *     tags:
 *       - Characters Stats
 *     summary: Eliminar los stats de un personaje
 *     description: Elimina los stats de un personaje existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del personaje cuyos stats serán eliminados
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
statsRouter.delete("/delete-stats/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;

		const deletedStats = await deleteStats(id);
		res.status(200).send(deletedStats);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = statsRouter;
