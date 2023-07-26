// /// =========================================================================== ///
// /// =============================== BATTLE CONTROLLER ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character, CharacterStats, Battle, BattleStats } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers')


/// <=============== controller getAllCharacters ===============>
async function startBattle(CharID, StatsID) {

	const character = await Character.findByPk(CharID);
	const charStats = await CharacterStats.findByPk(StatsID);

	const battleStats = await BattleStats.create({
		charID: CharID,
		charName: character.name,
		level: charStats.level,
		diceName: charStats.diceName,
		diceID: charStats.diceID,
		diceValue: charStats.diceValue,
		EXP: charStats.EXP,
		HP: charStats.HP,
		STR: charStats.STR,
		AGI: charStats.AGI,
		INT: charStats.INT,
		RES: charStats.RES,
		CHARM: charStats.CHARM,
		WIS: charStats.WIS,
	});

	const battleStatsCreated = await CharacterStats.findByPk(StatsID);

	const battle = await Battle.create({
		roundID: 0,
		battleStatsID: "default",
		roundsCount: 1,
		Characters: [CharID],
		WinnerID: null,
	});
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
			diceValue: 5,
			EXP: 1,
			HP: 100,
			STR: 1,
			AGI: 1,
			INT: 1,
			RES: 1,
			CHARM: 1,
			WIS: 1,
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


		return { message: `El personaje ${name} ha sido creado correctamente`, type: true, character: character, stats: stats };
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