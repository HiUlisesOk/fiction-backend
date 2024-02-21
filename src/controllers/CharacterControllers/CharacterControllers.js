// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character, CharacterStats, ActionLog } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers');
const { addLog } = require("../Logs/LogsControllers");


/// <=============== controller getAllCharacters ===============>
async function getAllCharacters() {
	const character = await Character.findAll({ where: { isActive: true, } });
	//Si la funcion no recibe nada, devuelve un error.
	if (!character) throw new Error("No se encontraron personajes");
	return character;
}

/// <=============== controller getCharacter ===============>
async function getCharacterById(ID) {
	const matchingCharacter = await Character.findOne({
		where: {
			ID: ID,
			[Op.and]: [{ isActive: true }]
		}
	});

	if (!matchingCharacter) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingCharacter;
}

async function getCharacterByUserId(ID) {
	const matchingCharacter = await Character.findAll({
		where: {
			UserID: ID,
			[Op.and]: [{ isActive: true }]
		}, include: {
			model: CharacterStats,
		}
	});

	if (!matchingCharacter) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingCharacter;
}

async function getCharacterByUsername(ID) {

	const matchingUser = await User.findOne({
		where: {
			username: ID,
		}
	});

	if (!matchingUser) throw new Error("El usuario no existe");

	const matchingCharacter = await Character.findAll({
		where: {
			UserID: matchingUser.ID,
			[Op.and]: [{ isActive: true }]
		}
	});

	if (!matchingCharacter) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingCharacter;
}

/// <=============== controller createCharacter ===============>
async function createCharacter(
	userID,
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


		const stats = await CharacterStats.create({
			level: 0,
			diceName: "default",
			diceID: 1,
			diceValue: 10,
			EXP: 5,
			HP: 100,
			STR: 5,
			AGI: 5,
			INT: 5,
			RES: 5,
			CHARM: 5,
			WIS: 5,
		});

		if (!stats) throw new Error("No se pudieron añadir stats a este personaje.");

		const matchingUser = await User.findOne({
			where: {
				[Op.or]: [{ ID: userID }],
			},
		});

		if (!matchingUser) throw new Error("El userID no es válido o no existe.");

		await matchingUser.addCharacter(character);
		await stats.setCharacter(character);
		// await character.setStats(stats);
		console.log('**/->ESTAMOS ACÁ<-/**' + userID)
		await addLog(2, userID, character?.ID, `Acaba de dar vida a un nuevo personaje! 🎭📜✨`, false, true, 'Character created')

		return { message: `El personaje ${name} ha sido creado correctamente`, type: true, character: character, stats: stats };
	} catch (error) {
		throw new Error("Error al crear el usuario: " + error.message);
	}
}


/// <=============== UPDATE USER ===============>

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
			ID: ID,
		}
	});

	if (!matchingCharacter) throw new Error("El personaje no existe");


	const updateThisCharacter = await Character.update(
		{
			name: name || matchingCharacter.name,
			charge: charge || matchingCharacter.charge,
			rank: rank || matchingCharacter.rank,
			guildName: guildName || matchingCharacter.guildName,
			guildID: guildID || matchingCharacter.guildID,
			avatar: avatar || matchingCharacter.avatar,
		},
		{
			where: { ID: ID },
		}
	);


	const updatedCharacter = await Character.findOne({
		where: {
			ID: ID,
		},

	});

	// if (!updatedCharacter) throw new Error("El personaje no pudo ser creado");
	console.log(updatedCharacter)



	return updatedCharacter;
}





//   ||==============| Delete Character |===============ooo<>
// To delete a Character.
const deleteCharacter = async (ID) => {
	const character = await Character.findByPk(ID)

	if (!character) throw new Error("Character not found");

	await Character.update(
		{
			isActive: false,
		},
		{
			where: { ID: ID },
		}
	);

	const characterUpdated = await Character.findByPk(ID)

	if (!characterUpdated) throw new Error("Character not found");

	return characterUpdated;
}


module.exports = {
	getAllCharacters,
	getCharacterById,
	createCharacter,
	updateCharacter,
	deleteCharacter,
	getCharacterByUserId,
	getCharacterByUsername,
};