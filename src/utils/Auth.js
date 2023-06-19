require("dotenv").config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ error: 'Acceso no autorizado' });
			return;
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			res.status(401).json({ error: 'Acceso no autorizado' });
			return;
		}

		const respTkn = jwt.verify(token, process.env.secretToken);
		console.log(respTkn)
		req.user = respTkn;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Token inválido' });
		return;
	}
}

module.exports = { authenticateToken };



