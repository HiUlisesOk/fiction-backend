// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic } = require("../db");
const { generateDateOnly, generateDateTime } = require('../utils/date')
const bcrypt = require('bcrypt');
/// <=============== controller getAllUsers ===============>
async function getAllUsersFromDb() {
	// Guardamos los datos de la API en data
	const users = await User.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!users) throw new Error("No se encontraron usuarios");
	return users;
}

/// <=============== POST - CREAR USER CONTROLLER ===============>

async function createUser(
	username,
	firstName,
	lastName,
	birthDate,
	email,
	password,
	userScore,
	profilePicture,
	isAdmin
) {
	//Si falta algun dato devolvemos un error
	if (!username) throw new Error("Falta firstName");
	if (!firstName) throw new Error("Falta firstName");
	if (!lastName) throw new Error("Falta lastName");
	if (!email) throw new Error("Falta email");
	if (!password) throw new Error("Falta password");


	const matchingUser = await User.findOne({
		where: {
			[Op.or]: [{ email: email }, { username: username }],
		},
		attributes: ['email', 'password'],
	});

	if (matchingUser) throw new Error("El usuario ya existe");

	// Obtener la contraseña del usuario (por ejemplo, desde req.body)
	const userPassword = password;

	// Generar el hash de la contraseña utilizando bcrypt
	const hashedPassword = await bcrypt.hash(userPassword, 10); // El segundo argumento es el "cost factor", cuanto mayor, más seguro pero más lento
	console.log(hashedPassword)
	// Almacenar el hash de la contraseña en la base de datos
	// Guardar hashedPassword en el campo correspondiente en la tabla de usuarios


	const [user, userCreated] = await User.findOrCreate({
		where: {
			username: username,
			firstName: firstName,
			lastName: lastName,
			profilePicture: profilePicture,
			birthDate: generateDateOnly(),
			email: email,
			password: hashedPassword,
			userScore: userScore,
			isAdmin: isAdmin
		},
	});
	console.log(userCreated)
	// Crea un topic asociado al usuario
	const topic = await Topic.create({
		title: 'Mi primer topic',
		author: username,
		authorID: user.ID
		// Otros campos del topic
	});

	// Crea un post asociado al usuario
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

	const newUser = {
		username,
		firstName,
		lastName,
		birthDate,
		email,
		hashedPassword,
		userScore,
		profilePicture,
		isAdmin
	}

	return newUser;
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
			where: { email }
		});

		if (!user) {
			console.log('User email not found:', email);
			throw new Error("User email not found");
		}

		console.log('User found:', user.email);

		const passwordsMatch = await bcrypt.compare(password, user.password);

		console.log('Email:', user.email);
		console.log('Password from login:', password);
		console.log('Password from DB:', user.password);
		console.log('Passwords match:', passwordsMatch);

		return { passwordsMatch, user: { ID, username, firstName, lastName, email } };
	} catch (error) {
		console.error('Authentication error:', error);
		throw error;
	}
};

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


module.exports = {
	getAllUsersFromDb,
	createUser,
	AuthLogin,
	updateUser,
	deleteUser
};
