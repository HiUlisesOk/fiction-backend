require("dotenv").config();
const jwt = require('jsonwebtoken');
const { userHasRole } = require('../controllers/Roles/userRoles')
const { getUserFromDb } = require('../controllers/UserControllers/UserControllers')

function authenticateToken(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			res.status(401).json({ error: '⛔ Acceso Token no autorizado' });
			return;
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			res.status(401).json({ error: '⛔ Acceso Token no autorizado' });
			return;
		}

		const respTkn = jwt.verify(token, process.env.secretToken);

		if (!respTkn) throw new Error("⛔ Token inválido");

		console.log(respTkn)
		req.user = respTkn;
		next();
	} catch (error) {
		res.status(401).json({ error: '⛔ Token inválido' });
		return;
	}
}

async function isAdmin(req, res, next) {
	try {
		const authUser = req.user;
		console.log('authUser', authUser)
		if (!authUser) {
			res.status(401).json({ error: '⛔ 🪪 Acceso no autorizado, no existen credenciales de autorización de administrador' });
			return;
		}

		const userID = authUser.id;
		console.log('userID', userID)
		if (!userID) {
			res.status(401).json({ error: '⛔ 🪪 Acceso no autorizado, las credenciales no tienen un id' });
			return;
		}

		const user = await getUserFromDb(userID)
		console.log('user', user)
		if (!user) {
			res.status(401).json({ error: '⛔ 🪪 Acceso no autorizado, el usuario no existe en la base de datos' });
			return;
		}


		const verifyAdmin = await userHasRole(userID, 'admin')
		console.log('verifyAdmin', verifyAdmin)
		if (!verifyAdmin) {
			res.status(403).json({ error: '⛔ 👮🏻‍♀️ Acceso no autorizado, no es administrador' });
			return;
		}

		if (!verifyAdmin && Number(userID) !== Number(user.ID)) {
			res.status(401).json({ error: '⛔ 👮🏻‍♀️ Acceso no autorizado 🛠️ solo los administradores pueden modificar los datos de otros usuarios' });
			return;
		}
		next();
	} catch (error) {
		res.status(401).json({ error: `⛔ 👮🏻‍♀️ Acceso no autorizado, ${error.message}` });
		return;
	}
}

async function userRestrict(req, res, next) {
	try {
		const authUser = req.user;
		if (!authUser) {
			return res.status(401).json({ error: '⛔ 👮🏻‍♀️ Acceso no autorizado, no existen credenciales de autorización de administrador' });
		}

		const userID = authUser.id;
		if (!userID) {
			return res.status(401).json({ error: '⛔ 🪪 Acceso no autorizado, las credenciales no tienen un id' });
		}

		const user = await getUserFromDb(userID);
		if (!user) {
			return res.status(401).json({ error: '⛔ 🪪 Acceso no autorizado, el usuario no existe en la base de datos' });
		}

		const requestedUserID = req.body.authorID || req.body.userID || req.body.UserID || req.params.id || req.params.ID || req.body.id || req.body.ID || req.query.id || req.query.ID || null;

		console.log('requestedUserID', requestedUserID)
		if (Number(userID) !== Number(requestedUserID)) {
			return res.status(403).json({ error: '⛔ 👮🏻‍♀️ Acceso no autorizado, no tienes autorización para editar o acceder a la información de otros usuarios' });
		}

		next();
	} catch (error) {
		return res.status(401).json({ error: `⛔ 😶‍🌫️ Acceso no autorizado, ${error.message}` });
	}
}





module.exports = { authenticateToken, isAdmin, userRestrict };



