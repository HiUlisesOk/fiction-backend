/**
 * @swagger
 * tags:
 *   - name: User Post
 *     description: Descripción de la categoría 1
 */
const { Router } = require("express");
const postRouter = Router();
const { authenticateToken, userRestrict } = require('../../utils/Auth');
const {
	createPost,
	getAllPostFromDb,
	updatePost,
	deletePost,
	getTopicsByUserId,
	getPostByTopicId,
	getPostById
} = require("../../controllers/UserControllers/PostControllers");

/**
 * @swagger
 * /get-all-post:
 *   get:
 *     tags:
 *       - User Post
 *     summary: Obtener todos los posts
 *     description: Obtiene una lista de todos los posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
postRouter.get("/get-all-post", authenticateToken, async (req, res) => {
	try {
		const postList = await getAllPostFromDb();
		res.status(200).send(postList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-post-byTopicId:
 *   get:
 *     tags:
 *       - User Post
 *     summary: Obtener posts por ID de tema
 *     description: Obtiene una lista de posts filtrados por ID de tema
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: topicId
 *         description: ID del tema
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
postRouter.get("/get-post-byTopicId", authenticateToken, async (req, res) => {
	try {
		const { topicId } = req.query;
		const postList = await getPostByTopicId(topicId);
		res.status(200).send(postList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-post-byId:
 *   get:
 *     tags:
 *       - User Post
 *     summary: Obtener un post por ID
 *     description: Obtiene un post específico por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         description: ID del post a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
postRouter.get("/get-post-byId", authenticateToken, async (req, res) => {
	try {
		const { id } = req.query;
		const postList = await getPostById(id);
		res.status(200).send(postList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-post-byUserId:
 *   get:
 *     tags:
 *       - User Post
 *     summary: Obtener posts por ID de usuario
 *     description: Obtiene una lista de posts filtrados por ID de usuario
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
 *       401:
 *         description: Error de autenticación
 */
postRouter.get("/get-post-byUserId", authenticateToken, async (req, res) => {
	try {
		const { userID } = req.query;
		const postList = await getTopicsByUserId(userID);
		res.status(200).send(postList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /create-post:
 *   post:
 *     tags:
 *       - User Post
 *     summary: Crear un nuevo post
 *     description: Crea un nuevo post con el contenido, el autor y el tema proporcionados
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               authorID:
 *                 type: string
 *               topicID:
 *                 type: string
 *             required:
 *               - content
 *               - authorID
 *               - topicID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
postRouter.post("/create-post", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { content, authorID, topicID } = req.body;
		const post = await createPost(content, authorID, topicID);
		res.status(200).send(post);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-post:
 *   put:
 *     tags:
 *       - User Post
 *     summary: Actualizar un post existente
 *     description: Actualiza el contenido, el autor, el postID y el temaID de un post existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               authorID:
 *                 type: string
 *               postID:
 *                 type: string
 *               topicID:
 *                 type: string
 *             required:
 *               - content
 *               - authorID
 *               - postID
 *               - topicID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
postRouter.put("/update-post", authenticateToken, async (req, res) => {
	try {
		const { content, authorID, postID, topicID } = req.body;
		const updatedPost = await updatePost(content, authorID, postID, topicID);
		res.status(200).send(updatedPost ? true : false);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-post:
 *   delete:
 *     tags:
 *       - User Post
 *     summary: Eliminar un post existente
 *     description: Elimina un post existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ID
 *         description: ID del post a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
postRouter.delete("/delete-post", authenticateToken, async (req, res) => {
	try {
		const { ID } = req.query;
		const deletedPost = await deletePost(ID);
		res.status(200).send(deletedPost ? true : false);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = postRouter;
