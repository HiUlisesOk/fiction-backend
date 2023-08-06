// /// =========================================================================== ///
// /// =============================== CONTROLLERS Stats ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character, Character_Info, Character_skills, CharacterStats } = require("../../db");
const bcrypt = require('bcrypt');



/// <=============== controller getAllStats ===============>
async function getAllStats() {
	const stats = await CharacterStats.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!stats) throw new Error("No se encontraron habilidades");
	return stats;
}

/// <=============== controller getCharacter ===============>
async function getStatsById(ID) {
	const matchingStats = await CharacterStats.findByPk(ID);

	if (!matchingStats) throw new Error("La habilidad no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingStats;
}

/// <=============== controller createStats ===============>
// SE CREA AL CREAR UN PERSONAJE
// async function createStats(
// 	name,
// 	desc,
// 	type,
// 	CharacterID,
// ) {
// 	if (!name) throw new Error("Falta name");
// 	if (!desc) throw new Error("Falta desc");
// 	if (!type) throw new Error("Falta type");
// 	if (!CharacterID) throw new Error("Falta CharacterID");


// 	try {
// 		const [stat, statCreated] = await CharacterStats.findOrCreate({
// 			where: {
// 				name,
// 				desc,
// 				type,
// 			},
// 		});

// 		if (!statCreated) throw new Error("La habilidad no pudo ser creada.");

// 		const matchingCharacter = await Character.findOne({
// 			where: {
// 				[Op.or]: [{ ID: CharacterID }],
// 			},
// 		});

// 		if (!matchingCharacter) throw new Error("El CharacterID no es válido o no existe.");

// 		await matchingCharacter.setCharacterStats(stat);


// 		return { message: `La  habilidad de ${matchingCharacter.name} ha sido creada correctamente.`, type: true, skill: skill, character: matchingCharacter };
// 	} catch (error) {
// 		throw new Error("Error al crear la ficha de rol del habilidad. " + error.message);
// 	}
// }


/// <=============== POST - UPDATE USER ===============>

async function updateStats(
	ID,
	level,
	diceName,
	diceID,
	diceValue,
	EXP,
	HP,
	STR,
	AGI,
	INT,
	RES,
	CHARM,
	WIS,
) {
	//Si falta algun dato devolvemos un error
	if (!ID) throw new Error("Falta ID");


	const matchingStats = await CharacterStats.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		}
	});

	if (!matchingStats) throw new Error("La tabla de stats no existe");


	const updateThisStat = await CharacterStats.update(
		{
			level,
			diceName,
			diceID,
			diceValue,
			EXP,
			HP,
			STR,
			AGI,
			INT,
			RES,
			CHARM,
			WIS,
		},
		{
			where: { ID: ID },
		}
	);


	const updatedStats = await CharacterStats.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		},

	});

	if (!updatedStats) throw new Error("La tabla de stats no pudo ser modificada");
	console.log(updatedStats)



	return updatedStats;
}





//   ||==============| Delete Character |===============ooo<>
// To delete a Sheet.
const deleteStats = async (ID) => {
	const stats = await CharacterStats.findByPk(ID)

	if (!stats) throw new Error("Stats not found");

	await CharacterStats.destroy({
		where: {
			ID: ID,
		},
	});

	return stats;
}


module.exports = {
	getAllStats, getStatsById, updateStats, deleteStats
};