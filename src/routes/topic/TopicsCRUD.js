const { Router } = require("express");
const TopicRouter = Router();
const { authenticateToken } = require('../../utils/Auth')
const {
	getAllTopicsFromDb, CreateTopic, updateTopic, deleteTopic
} = require("../../controllers/TopicsControllers");


TopicRouter.get("/get-all-topics", authenticateToken, async (req, res) => {
	try {
		const TopicList = await getAllTopicsFromDb();
		res.status(200).send(TopicList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

TopicRouter.post("/create-topic", async (req, res) => {
	try {
		const {
			title, authorID
		} = req.body;

		const user = await CreateTopic(title, authorID);
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