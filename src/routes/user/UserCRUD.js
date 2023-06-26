const { Router } = require("express");
const userRouter = Router();
const { authenticateToken } = require('../../utils/Auth')
const {
	getAllUsersFromDb,
	createUser,
	AuthLogin,
	updateUser,
	deleteUser,
	uploadProfilePicture
} = require("../../controllers/UserControllers.js");


userRouter.get("/get-all-users", authenticateToken, async (req, res) => {
	try {
		const userList = await getAllUsersFromDb();
		res.status(200).send(userList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});



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

userRouter.put("/update-profilePicture", authenticateToken, async (req, res) => {
	try {
		const {
			imagen64,
			ID,
			username,
			email,
			profilePicture,
		} = req.body;

		const profilePic = await uploadProfilePicture(
			imagen64,
			ID,
			username,
			email,
			profilePicture,
		);
		res.status(200).send(profilePic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

userRouter.put("/update-user", authenticateToken, async (req, res) => {
	try {
		const {
			ID,
			username,
			firstName,
			lastName,
			birthDate,
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
			email,
			userScore,
			profilePicture,
		);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

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