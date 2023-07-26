const { Router } = require("express");
const skillsRouter = Router();
const { authenticateToken } = require('../../utils/Auth');
const {
	getAllSkills, getSkillsById, createSkills, updateSkills, deleteSkill
} = require("../../controllers/CharacterControllers/SkillsControllers");

/**
 * @swagger
 * /get-skills:
 *   get:
 *     tags:
 *       - Roleplay Skills
 *     summary: Obtener todas las habilidades
 *     description: Obtiene una lista de todas las habilidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
skillsRouter.get("/get-skills", authenticateToken, async (req, res) => {
	try {
		const skillsList = await getAllSkills();
		if (skillsList.length < 1) return res.status(404).send('No existen skills creadas');
		res.status(200).send(skillsList);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

/**
 * @swagger
 * /get-skills-by-id/{id}:
 *   get:
 *     tags:
 *       - Roleplay Skills
 *     summary: Obtener información de una habilidad por ID
 *     description: Obtiene la información de una habilidad específica por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la habilidad a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
skillsRouter.get("/get-skills-by-id/:id", authenticateToken, async (req, res) => {
	try {
		const ID = req.params.id;
		const skillInfo = await getSkillsById(ID);
		res.status(200).send(skillInfo);
	} catch (error) {
		res.status(404).send(error.message);
	}
});

/**
 * @swagger
 * /create-skills:
 *   post:
 *     tags:
 *       - Roleplay Skills
 *     summary: Crear una nueva habilidad
 *     description: Crea una nueva habilidad con los datos proporcionados
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               type:
 *                 type: string
 *               CharacterID:
 *                 type: integer
 *             required:
 *               - name
 *               - desc
 *               - type
 *               - CharacterID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
skillsRouter.post("/create-skills", async (req, res) => {
	try {
		const {
			name,
			desc,
			type,
			CharacterID,
		} = req.body;

		const skill = await createSkills(
			name,
			desc,
			type,
			CharacterID,
		);
		res.status(200).send(skill);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /edit-skills/{id}:
 *   put:
 *     tags:
 *       - Roleplay Skills
 *     summary: Actualizar una habilidad existente
 *     description: Actualiza los datos de una habilidad existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la habilidad a actualizar
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               type:
 *                 type: string
 *             required:
 *               - name
 *               - desc
 *               - type
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
skillsRouter.put("/edit-skills/{id}", authenticateToken, async (req, res) => {
	try {
		const {
			ID,
			name,
			desc,
			type,
		} = req.body;

		const skill = await updateCharacter(
			ID,
			name,
			desc,
			type,
		);
		res.status(200).send(skill);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-skills/{id}:
 *   delete:
 *     tags:
 *       - Roleplay Skills
 *     summary: Eliminar una habilidad existente
 *     description: Elimina una habilidad existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de la habilidad a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
skillsRouter.delete("/delete-skills/:id", authenticateToken, async (req, res) => {
	try {
		const { ID } = req.query;

		const skill = await deletecharacter(ID);
		res.status(200).send(skill);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = skillsRouter;
