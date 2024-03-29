/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operaciones relacionadas con los usuarios
 */

const { Router } = require("express");
const userRouter = Router();
const { authenticateToken, isAdmin, userRestrict } = require('../../utils/Auth');
const {
	getAllUsersFromDb,
	createUser,
	AuthLogin,
	AuthToken,
	updateUser,
	deleteUser,
	uploadProfilePicture,
	getUserFromDb,
	getUserByUsername,
	getMostActiveUsers,
	updateBannerPicture,
} = require("../../controllers/UserControllers/UserControllers");

const { getRolesFromUserID } = require('../../controllers/Roles/userRoles')



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
		res.status(401).send({ message: error.message, code: 401 });
	}
});

/**
 * @swagger
 * /get-user-roles:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener roles de usuario por id
 *     description: Obtiene la información de un usuario por su id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: Id de usuario del usuario a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.get("/get-user-roles", authenticateToken, userRestrict, async (req, res) => {
	try {
		const { id } = req.query;

		const userRoles = await getRolesFromUserID(id);

		if (!userRoles) {
			return res.status(404).send("Usuario no encontrado");
		}

		res.status(200).send(userRoles);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /get-user-info:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener información de usuario por nombre de usuario
 *     description: Obtiene la información de un usuario por su nombre de usuario
 *     parameters:
 *       - name: username
 *         in: query
 *         required: true
 *         description: Nombre de usuario del usuario a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.get("/get-user-info", async (req, res) => {
	try {
		const { username } = req.query;

		const userInfo = await getUserByUsername(username);

		if (!userInfo) {
			return res.status(404).send("Usuario no encontrado");
		}

		res.status(200).send(userInfo);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /AuthToken:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Autenticar un token valido
 *     description: Autenticar un token valido
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The authentication token
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.post("/AuthToken", authenticateToken, async (req, res) => {
	try {
		res.status(200).send(true);
	} catch (error) {
		res.status(401).send({ status: false, error: error.message });
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
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
			email,
			password,
		} = req.body;

		const user = await createUser(
			username,

			email,
			password,

		);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

/**
 * @swagger
 * /update-profilePicture:
 *   post:
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
 *             required:
 *               - imagen64
 *               - ID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.post("/update-profilePicture", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			imagen64,
			ID,
		} = req.body;

		const profilePic = await uploadProfilePicture(
			imagen64,
			ID,
		);
		if (!profilePic) throw new Error("Error al actualizar la imagen de perfil");
		res.status(200).send(profilePic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});


/**
 * @swagger
 * /update-banner:
 *   post:
 *     tags:
 *       - Users
 *     summary: Actualizar la imagen del banner del perfil de un usuario
 *     description: Actualiza la imagen del banner del perfil de un usuario específico
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               link:
 *                 type: string
 *               ID:
 *                 type: integer
 *             required:
 *               - link
 *               - ID
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
userRouter.post("/update-banner", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			link,
			ID,
		} = req.body;

		const profilePic = await updateBannerPicture(
			link,
			ID,
		);
		if (!profilePic) throw new Error("Error al actualizar la imagen de perfil");
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
userRouter.put("/update-user", authenticateToken, userRestrict, async (req, res) => {
	try {
		const {
			ID,
			username,
			firstName,
			lastName,
			birthDate,
			bio,
			email,
		} = req.body;

		const user = await updateUser(
			ID,
			username,
			firstName,
			lastName,
			birthDate,
			bio,
			email,
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
userRouter.delete("/delete-user", authenticateToken, isAdmin, async (req, res) => {
	try {
		const { ID } = req.query;

		const user = await deleteUser(ID);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});


/**
 * @swagger
 * /get-most-active-users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtener los 8 usuarios con mas actividad
 *     description: Obtiene una lista de 8 usuarios mas activos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
userRouter.get("/get-most-active-users", authenticateToken, async (req, res) => {
	try {
		const userList = await getMostActiveUsers();
		res.status(200).send(userList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});
module.exports = userRouter;
