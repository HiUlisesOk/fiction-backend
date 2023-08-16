/**
 * @swagger
 * tags:
 *   - name: Images
 *     description: Operaciones relacionadas con imágenes
 */

const { Router } = require("express");
const imagesImgurAPI = Router();
const { authenticateToken, isAdmin, userRestrict } = require('../../utils/Auth');
const { generateAccessToken, uploadImage } = require('../../controllers/imagesControllers.js');
const convertImageToBase64 = require('../../utils/convertImageToBase64');

/**
 * @swagger
 * /get-imgur-image-token:
 *   get:
 *     tags:
 *       - Images
 *     summary: Obtener token de Imgur
 *     description: Obtiene un token de acceso de Imgur para subir imágenes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Error de autenticación
 */
imagesImgurAPI.get("/get-imgur-image-token", authenticateToken, isAdmin, async (req, res) => {
	try {
		const token = await generateAccessToken();
		process.env.bearer_token = 'Bearer ' + token;
		res.status(200).send(token);
	} catch (error) {
		res.status(401).send(error.message);
	}
});

/**
 * @swagger
 * /upload-image:
 *   post:
 *     tags:
 *       - Images
 *     summary: Subir una imagen a Imgur
 *     description: Sube una imagen en formato base64 a Imgur
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
 *             required:
 *               - imagen64
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Error de solicitud inválida
 */
imagesImgurAPI.post("/upload-image", authenticateToken, async (req, res) => {
	try {
		const { imagen64 } = req.body;
		const imageUploaded = await uploadImage(imagen64);
		res.status(200).send(imageUploaded);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

module.exports = imagesImgurAPI;

