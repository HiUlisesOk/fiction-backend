/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operaciones relacionadas con los usuarios
 */

const { Router } = require("express");
const userRouter = Router();
const { authenticateToken } = require('../../utils/Auth');
const {
	getAllUsersFromDb,
	createUser,
	AuthLogin,
	updateUser,
	deleteUser,
	uploadProfilePicture,
	getUserFromDb,
} = require("../../controllers/UserControllers/UserControllers");

/**
 * @swagger
 * /get-all-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista de todos los usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
userRouter.get("/get-all-users", authenticateToken, async (req, res) => {
	try {
		const userList = await getAllUsersFromDb();
		res.status(200).send(userList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /get-user-info/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener información de un usuario por ID
 *     description: Obtiene la información de un usuario específico por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID del usuario a obtener
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
userRouter.get("/get-user-info/:id", authenticateToken, async (req, res) => {
	try {
		const userID = req.params.id;
		const userInfo = await getUserFromDb(userID);
		res.status(200).send(userInfo);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /create-user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userScore:
 *                 type: number
 *               profilePicture:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *             required:
 *               - username
 *               - firstName
 *               - lastName
 *               - birthDate
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.post("/create-user", async (req, res) => {
	try {
		const {
			username,
			firstName,
			lastName,
			birthDate,
			email,
			password,
			userScore,
			profilePicture,
			isAdmin
		} = req.body;

		const user = await createUser(
			username,
			firstName,
			lastName,
			birthDate,
			email,
			password,
			userScore,
			profilePicture,
			isAdmin
		);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-profilePicture:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar la imagen de perfil de un usuario
 *     description: Actualiza la imagen de perfil de un usuario específico
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imagen64:
 *                 type: string
 *               ID:
 *                 type: integer
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - imagen64
 *               - ID
 *               - username
 *               - email
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.put("/update-profilePicture", authenticateToken, async (req, res) => {
	try {
		const {
			imagen64,
			ID,
			username,
			email,
		} = req.body;

		const profilePic = await uploadProfilePicture(
			imagen64,
			ID,
			username,
			email,
		);
		res.status(200).send(profilePic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-user:
 *   put:
 *     tags:
 *       - Users
 *     summary: Actualizar un usuario existente
 *     description: Actualiza los datos de un usuario existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID:
 *                 type: integer
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               userScore:
 *                 type: number
 *               profilePicture:
 *                 type: string
 *             required:
 *               - ID
 *               - username
 *               - firstName
 *               - lastName
 *               - birthDate
 *               - email
 *               - userScore
 *               - profilePicture
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.put("/update-user", authenticateToken, async (req, res) => {
	try {
		const {
			ID,
			username,
			firstName,
			lastName,
			birthDate,
			bio,
			email,
			userScore,
			profilePicture,
		} = req.body;

		const user = await updateUser(
			ID,
			username,
			firstName,
			lastName,
			birthDate,
			bio,
			email,
			userScore,
			profilePicture,
		);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /delete-user:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Eliminar un usuario existente
 *     description: Elimina un usuario existente por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ID
 *         description: ID del usuario a eliminar
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.delete("/delete-user", authenticateToken, async (req, res) => {
	try {
		const { ID } = req.query;

		const user = await deleteUser(ID);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = userRouter;
