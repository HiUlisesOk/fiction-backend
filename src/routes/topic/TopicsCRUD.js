const { Router } = require("express");
const TopicRouter = Router();
const { authenticateToken } = require('../../utils/Auth')
const {
	CreateTopic,
	getAllTopicsFromDb,
	getTopicsById,
	getTopicsByUserId,
	getLastActiveTopics,
	updateTopic,
	deleteTopic
} = require("../../controllers/TopicsControllers");


TopicRouter.get("/get-all-topics", authenticateToken, async (req, res) => {
	try {
		const TopicList = await getAllTopicsFromDb();
		res.status(200).send(TopicList);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

TopicRouter.get("/get-topic", authenticateToken, async (req, res) => {
	const { id } = req.query;
	try {
		const Topic = await getTopicsById(id);
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

TopicRouter.get("/get-topicByUserID", authenticateToken, async (req, res) => {
	const { userID } = req.query;
	try {
		const Topic = await getTopicsByUserId(userID);
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});


TopicRouter.get("/getLastActiveTopics", authenticateToken, async (req, res) => {
	try {
		const Topic = await getLastActiveTopics();
		res.status(200).send(Topic);
	} catch (error) {
		res.status(400).send(error.message);
	}
});



TopicRouter.post("/create-topic", async (req, res) => {
	try {
		const {
			title, authorID, content
		} = req.body;

		const user = await CreateTopic(title, authorID, content);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

TopicRouter.put("/update-topic", authenticateToken, async (req, res) => {
	try {
		const {
			authorID, topicID, title
		} = req.body;

		const user = await updateTopic(authorID, topicID, title);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

TopicRouter.delete("/delete-topic", authenticateToken, async (req, res) => {
	try {
		const { ID } = req.query;

		const user = await deleteTopic(ID);
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error.message);
	}
});


module.exports = TopicRouter;