const { Router } = require("express");
const imagesImgurAPI = Router();
const { authenticateToken } = require('../../utils/Auth')
const { generateAccessToken, uploadImage } = require('../../controllers/imagesControllers.js')
const convertImageToBase64 = require('../../utils/convertImageToBase64')


imagesImgurAPI.get("/get-imgur-image-token", authenticateToken, async (req, res) => {
	try {
		const token = await generateAccessToken();
		console.log(token);
		process.env.bearer_token = 'Bearer ' + token;
		res.status(200).send(token);
	} catch (error) {
		res.status(401).send(error.message);
	}
});



imagesImgurAPI.post("/upload-image", authenticateToken, async (req, res) => {
	try {
		const {
			imagen64
		} = req.body;

		const imageUploaded = await uploadImage(imagen64);
		res.status(200).send(imageUploaded);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

// imagesImgurAPI.put("/update-post", async (req, res) => {
// 	try {
// 		const {
// 			content, authorID, postID, topicID
// 		} = req.body;

// 		const Post = await updatePost(
// 			content,
// 			authorID,
// 			postID,
// 			topicID
// 		);
// 		res.status(200).send(Post ? true : false);
// 	} catch (error) {
// 		res.status(400).send(error.message);
// 	}
// });

// imagesImgurAPI.delete("/delete-post", async (req, res) => {
// 	try {
// 		const { ID } = req.query;

// 		const Post = await deletePost(ID);
// 		res.status(200).send(Post ? true : false);
// 	} catch (error) {
// 		res.status(400).send(error.message);
// 	}
// });


module.exports = imagesImgurAPI;
