// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character } = require("../db");
const { generateDateOnly, generateDateTime } = require('../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('./imagesControllers')


/// <=============== controller getAllCharacters ===============>
async function getAllCharacters() {
	const character = await Character.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!character) throw new Error("No se encontraron personajes");
	return character;
}

/// <=============== controller getCharacter ===============>
async function getCharacterById(ID) {
	const matchingCharacter = await Character.findByPk(ID);

	if (!matchingCharacter) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingCharacter;
}

/// <=============== controller createCharacter ===============>
async function createCharacter(
	name,
	avatar,
	charge,
	rank,
) {
	if (!name) throw new Error("Falta name");

	const matchingCharacter = await Character.findOne({
		where: {
			[Op.or]: [{ name: name }],
		},
	});

	if (matchingCharacter) throw new Error("El personaje ya existe");

	try {
		const [character, characterCreated] = await Character.findOrCreate({
			where: {
				name: name,
				avatar: avatar || "",
				charge: charge || "",
				rank: rank || "",
			},
		});

		if (!characterCreated) throw new Error("El personaje no pudo ser creado.");

		return { message: `El personaje ${name} ha sido creado correctamente`, type: true };
	} catch (error) {
		throw new Error("Error al crear el usuario: " + error.message);
	}
}


/// <=============== POST - UPDATE USER ===============>

async function updateCharacter(
	ID,
	name,
	avatar,
	charge,
	rank,
	guildName,
	guildID
) {
	//Si falta algun dato devolvemos un error
	if (!ID) throw new Error("Falta ID");


	const matchingCharacter = await Character.findOne({
		where: {
			[Op.or]: [{ ID: ID }, { name: name }],
		}
	});

	if (!matchingCharacter) throw new Error("El personaje no existe");


	const updateThisCharacter = await Character.update(
		{
			name: name || "",
			charge: charge || "",
			rank: rank || "",
			guildName: guildName || "",
			guildID: guildID || "",
			avatar: avatar || "",
		},
		{
			where: { ID: ID },
		}
	);


	const updatedCharacter = await Character.findOne({
		where: {
			[Op.or]: [{ name: name }, { ID: ID }],
		},

	});

	// if (!updatedCharacter) throw new Error("El personaje no pudo ser creado");
	console.log(updatedCharacter)



	return updatedCharacter;
}





//   ||==============| Delete Character |===============ooo<>
// To delete an user.
const deleteUser = async (ID) => {
	const character = await Character.findByPk(ID)

	if (!character) throw new Error("Character not found");

	await Character.destroy({
		where: {
			ID: ID,
		},
	});

	return character;
}


module.exports = {
	getAllCharacters,
	getCharacterById,
	createCharacter,
	updateCharacter,
	deleteUser,
};