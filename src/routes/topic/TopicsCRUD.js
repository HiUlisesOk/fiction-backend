/**
 * @swagger
 * tags:
 *   - name: Topics
 *     description: Operaciones relacionadas con los temas
 */

const { Router } = require("express");
const TopicRouter = Router();
const { authenticateToken, userRestrict } = require('../../utils/Auth');
const {
	CreateTopic,
	getAllTopicsFromDb,
	getTopicsById,
	getTopicsByUserId,
	getLastActiveTopics,
	updateTopic,
	deleteTopic,
} = require("../../controllers/UserControllers/TopicsControllers");

/**
 * @swagger
 * /get-all-topics:
 *   get:
 *     tags:
 *       - Topics
 *     summary: Obtener todos los temas
 *     description: Obtiene una lista de todos los temas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.get("/get-all-topics", authenticateToken, async (req, res) => {
	try {
		const TopicList = await getAllTopicsFromDb();
		res.status(200).send(TopicList);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /get-topic:
 *   get:
 *     tags:
 *       - Topics
 *     summary: Obtener un tema por ID
 *     description: Obtiene un tema específico por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID del tema a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.get("/get-topic", authenticateToken, async (req, res) => {
	const { id } = req.query;
	try {
		const Topic = await getTopicsById(id);
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /get-topicByUserID:
 *   get:
 *     tags:
 *       - Topics
 *     summary: Obtener temas por ID de usuario
 *     description: Obtiene una lista de temas filtrados por ID de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userID
 *         description: ID del usuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.get("/get-topicByUserID", authenticateToken, async (req, res) => {
	const { userID } = req.query;
	try {
		const Topic = await getTopicsByUserId(userID);
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /getLastActiveTopics:
 *   get:
 *     tags:
 *       - Topics
 *     summary: Obtener últimos temas activos
 *     description: Obtiene una lista de los últimos temas activos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.get("/getLastActiveTopics", authenticateToken, async (req, res) => {
	try {
		const Topic = await getLastActiveTopics();
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /create-topic:
 *   post:
 *     tags:
 *       - Topics
 *     summary: Crear un nuevo tema
 *     description: Crea un nuevo tema con el título, el autor y el contenido proporcionados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authorID:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - authorID
 *               - content
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.post("/create-topic", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { title, authorID, content } = req.body;
		const user = await CreateTopic(title, authorID, content);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-topic:
 *   put:
 *     tags:
 *       - Topics
 *     summary: Actualizar un tema existente
 *     description: Actualiza el autor y el título de un tema existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorID:
 *                 type: string
 *               topicID:
 *                 type: string
 *               title:
 *                 type: string
 *             required:
 *               - authorID
 *               - topicID
 *               - title
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.put("/update-topic", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { authorID, topicID, title } = req.body;
		const user = await updateTopic(authorID, topicID, title);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-topic:
 *   delete:
 *     tags:
 *       - Topics
 *     summary: Eliminar un tema existente
 *     description: Elimina un tema existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ID
 *         description: ID del tema a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
TopicRouter.delete("/delete-topic", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { ID } = req.query;
		const user = await deleteTopic(ID);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = TopicRouter;
