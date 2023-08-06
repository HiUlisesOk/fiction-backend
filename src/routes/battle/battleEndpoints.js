/**
 * @swagger
 * tags:
 *   - name: Battle Endpoints
 *     description: Operaciones relacionadas con las batallas entre personajes
 */

const { Router } = require("express");
const battleRouter = Router();
const { authenticateToken } = require('../../utils/Auth');
const {
	startBattle,
	takeTurn
} = require("../../controllers/BattleControllers/BattleController");


/**
 * @swagger
 * /start-battle:
 *   post:
 *     tags:
 *       - Battle Endpoints
 *     summary: Inicia una batalla entre personajes
 *     description: Inicia una batalla entre personajes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CharID
 *         description: ID del personaje
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: objectiveID
 *         description: ID del objetivo
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: actionTypes
 *         description: Tipo de acción ( 1 ATK, 2 DEF,  3 HEAL, 4 ILU, 5 SKIP)
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batalla iniciada correctamente
 *       401:
 *         description: Error de autenticación o parámetros inválidos
 */

battleRouter.post("/start-battle", authenticateToken, async (req, res) => {
	try {
		const {
			CharID, objectiveID, actionTypes
		} = req.query;
		const characterList = await startBattle(CharID, objectiveID, actionTypes);
		res.status(200).send(characterList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

// /// <=============== takeTurn ===============>
/**
 * @swagger
 * /take-turn:
 *   post:
 *     tags:
 *       - Battle Endpoints
 *     summary: Toma un turno en una batalla
 *     description: Toma un turno en una batalla
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: CharID
 *         description: ID del personaje
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: BattleID
 *         description: ID de la batalla
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action
 *         description: Tipo de acción (ATK, DEF, HEAL, ILU, SKIP)
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *           description: |
 *             1: ATK (Attack)
 *             2: DEF (Defense)
 *             3: HEAL (Heal)
 *             4: ILU (Illusion)
 *             5: SKIP (Skip Turn)
 *       - in: query
 *         name: action2
 *         description: Tipo de acción (ATK, DEF, HEAL, ILU, SKIP)
 *         required: false
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3, 4, 5]
 *           description: |
 *             1: ATK (Attack)
 *             2: DEF (Defense)
 *             3: HEAL (Heal)
 *             4: ILU (Illusion)
 *             5: SKIP (Skip Turn)
 *       - in: query
 *         name: objectiveID
 *         description: ID del objetivo
 *         required: true
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *             result:
 *               type: string
 *               description: Result of the turn
 *       404:
 *         description: Error de autenticación
 */


battleRouter.post("/take-turn", authenticateToken, async (req, res) => {
	try {
		const { CharID, BattleID, action, action2, objectiveID } = req.query;
		const newTurn = await takeTurn(CharID, BattleID, action, action2, objectiveID);
		if (!newTurn) throw new Error("El turno no es válido o no existe.");
		res.status(200).send({ result: newTurn });
	} catch (error) {
		res.status(404).send(error.message);
	}
});

module.exports = battleRouter;
