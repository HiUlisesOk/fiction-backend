const { Router } = require("express");
const postRouter = Router();
const { authenticateToken } = require('../../utils/Auth')
const { createPost, getAllPostFromDb, updatePost, deletePost } = require("../../controllers/PostControllers");


postRouter.get("/get-all-post", authenticateToken, async (req, res) => {
	try {
		const postList = await getAllPostFromDb();
		res.status(200).send(postList);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

postRouter.post("/create-post", async (req, res) => {
	try {
		const {
			content,
			authorID,
			topicID,
		} = req.body;

		const Post = await createPost(
			content,
			authorID,
			topicID,
		);
		res.status(200).send(Post);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

postRouter.put("/update-post", async (req, res) => {
	try {
		const {
			content, authorID, postID, topicID
		} = req.body;

		const Post = await updatePost(
			content,
			authorID,
			postID,
			topicID
		);
		res.status(200).send(Post ? true : false);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

postRouter.delete("/delete-post", async (req, res) => {
	try {
		const { ID } = req.query;

		const Post = await deletePost(ID);
		res.status(200).send(Post ? true : false);
	} catch (error) {
		res.status(400).send(error.message);
	}
});


module.exports = postRouter;
