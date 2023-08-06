// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers')


/// <=============== controller getAllUsers ===============>
async function getAllUsersFromDb() {
	const users = await User.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!users) throw new Error("No se encontraron usuarios");
	return users;
}

/// <=============== controller getUSER ===============>
async function getUserFromDb(userID) {
	const matchingUser = await User.findOne({
		where: {
			ID: userID,
		},
	});

	if (!matchingUser) throw new Error("El usuario no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingUser;
}

async function createUser(
	username,
	firstName,
	lastName,
	birthDate,
	email,
	password,
	userScore,
	profilePicture,
) {
	if (!username) throw new Error("Falta username");
	if (!email) throw new Error("Falta email");
	if (!password) throw new Error("Falta password");

	const matchingUser = await User.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }],
		},
		attributes: ['email', 'password'],
	});

	if (matchingUser) throw new Error("El usuario ya existe");

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const [user, userCreated] = await User.findOrCreate({
			where: {
				username: username,
				email: email,
				password: hashedPassword,
			},
		});

		if (!userCreated) throw new Error("El usuario ya existe en la base de datos");

		const topic = await Topic.create({
			title: 'Mi primer topic',
			author: username,
			authorID: user.ID
			// Otros campos del topic
		});

		const post = await Post.create({
			title: 'Mi primer post',
			content: 'Hola! 😎',
			author: username,
			authorID: user.ID,
			topicID: topic.ID
			// Otros campos del post
		});

		await user.addPost(post);
		await user.addTopic(topic);
		await post.setTopic(topic);

		return { message: `El usuario ${username} ha sido creado correctamente`, type: true };
	} catch (error) {
		throw new Error("Error al crear el usuario: " + error.message);
	}
}


/// <=============== POST - UPDATE USER ===============>

async function updateUser(
	ID,
	username,
	firstName,
	lastName,
	birthDate,
	email,
	userScore,
	profilePicture,
) {
	//Si falta algun dato devolvemos un error
	if (!ID) throw new Error("Falta ID del usuario");
	if (!username) throw new Error("Falta firstName");
	if (!firstName) throw new Error("Falta firstName");
	if (!lastName) throw new Error("Falta lastName");
	if (!birthDate) throw new Error("Falta birthDate");
	if (!email) throw new Error("Falta email");
	if (!userScore) throw new Error("Falta userScore");

	const matchingUser = await User.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }, { ID: ID }],
		},
		attributes: ['email', 'password'],
	});

	if (!matchingUser) throw new Error("El usuario no existe");


	const updateThisUser = await User.update(
		{
			username: username,
			firstName: firstName,
			lastName: lastName,
			profilePicture: profilePicture,
			birthDate: generateDateOnly(),
			email: email,
			userScore: userScore,
		},
		{
			where: { ID: ID },
		}
	);


	const updatedUser = await User.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }, { ID: ID }],
		},

	});

	if (!matchingUser) throw new Error("El usuario no existe");
	console.log(updatedUser)



	return updatedUser;
}


///// <=============== controller AUTH & LOGIN ===============>
const AuthLogin = async (email, password) => {
	if (!email) throw new Error("email is required");
	if (!password) throw new Error("password is required");

	try {
		// Lógica de autenticación
		// Consulta una base de datos para verificar las credenciales

		const user = await User.findOne({
			[Op.or]: [{ email: email }, { username: email }]
		});

		if (!user) {
			console.log('User email not found:', email);
			throw new Error("User email not found");
		}

		console.log('User found:', user.email);

		const passwordsMatch = await bcrypt.compare(password, user.password);
		if (!passwordsMatch) {
			console.log('Las contraseñas no coinciden', email);
			throw new Error("Password not found");
		}
		console.log('Email:', user.email);
		console.log('Password from login:', password);
		console.log('Password from DB:', user.password);
		console.log('Passwords match:', passwordsMatch);

		return { passwordsMatch, user: { ID: user.ID, username: user.username, firstName: user.firstName, email: user.email } };
	} catch (error) {
		console.error('Authentication error:', error);
		throw error;
	}
};


//   ||==============| Upload Image |===============ooo<>
// To delete an user.
const deleteUser = async (ID) => {
	const user = await User.findByPk(ID)

	if (!user) throw new Error("User not found");

	await user.destroy({
		where: {
			ID: ID,
		},
	});

	return user;
}

//   ||==============| Upload Image |===============ooo<>
// Updates an user's profile picture.

async function uploadProfilePicture(imagen64, ID, username, email) {
	if (!imagen64) throw new Error("Falta userScore");
	if (!ID && !username && !email) throw new Error("Falta ID, username o email del usuario");


	const matchingUser = await User.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }, { ID: ID }],
		},
		attributes: ['email', 'password'],
	});

	if (!matchingUser) throw new Error("El usuario no existe");
	console.log(matchingUser);

	try {
		let link;
		try {
			link = await uploadImage(imagen64);
		} catch (uploadError) {
			console.error('Error during image upload:', uploadError);
			throw new Error("Error al cargar la imagen");
		}

		if (!link) throw new Error("La función uploadImage no retornó un enlace válido");
		console.log('link:', link);

		const updateThisUser = await User.update(
			{
				profilePicture: link,
			},
			{
				where: {
					[Op.or]: [{ email: email }, { username: username }, { ID: ID }],
				},
			}
		);

		return updateThisUser;
	} catch (error) {
		console.error('Error during profile picture upload:', error);
		throw error;
	}
}



module.exports = {
	getAllUsersFromDb,
	uploadProfilePicture,
	createUser,
	AuthLogin,
	updateUser,
	deleteUser,
	getUserFromDb
};
