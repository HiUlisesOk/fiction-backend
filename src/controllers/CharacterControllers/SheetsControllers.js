// /// =========================================================================== ///
// /// =============================== CONTROLLERS SHEETS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character, CharacterStats, Character_Info } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers');
const { addLog } = require("../Logs/LogsControllers");


/// <=============== controller getAllCharacters ===============>
async function getAllSheets() {
	const sheets = await Character_Info.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!sheets) throw new Error("No se encontraron fichas de rol");
	return sheets;
}

/// <=============== controller getCharacter ===============>
async function getSheetsById(ID) {
	const matchingSheets = await Character_Info.findByPk(ID);

	if (!matchingSheets) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingSheets;
}

/// <=============== controller getCharacter ===============>
async function getSheetByCharId(ID) {
	const matchingSheets = await Character_Info.findAll({ where: { CharacterID: ID } });

	if (!matchingSheets) throw new Error("El personaje no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingSheets;
}

/// <=============== controller createSheets ===============>
async function createSheets(

	realAge,
	fisicalAge,
	sexOrientation,
	ocInfo,
	reputation,
	isDead,
	theme,
	history,
	extraData,
	fisicalDesc,
	Psicology,
	CharacterID,

) {
	if (!realAge) throw new Error("Falta realAge");
	if (!fisicalAge) throw new Error("Falta fisicalAge");
	if (!sexOrientation) throw new Error("Falta sexOrientation");
	if (!ocInfo) throw new Error("Falta ocInfo");
	if (!reputation) throw new Error("Falta reputation");
	if (typeof isDead === 'undefined') isDead = false; // Assuming isDead is a boolean, set default value to false
	if (!theme) throw new Error("Falta theme");
	if (!history) throw new Error("Falta history");
	if (!extraData) throw new Error("Falta extraData");
	if (!fisicalDesc) throw new Error("Falta fisicalDesc");
	if (!Psicology) throw new Error("Falta Psicology");
	if (!CharacterID) throw new Error("Falta CharacterID");


	try {
		const [sheet, sheetCreated] = await Character_Info.findOrCreate({
			where: {
				realAge: realAge,
				fisicalAge: fisicalAge,
				sexOrientation: sexOrientation,
				ocInfo: ocInfo,
				reputation: reputation,
				isDead: isDead,
				theme: theme,
				history: history,
				extraData: extraData,
				fisicalDesc: fisicalDesc,
				Psicology: Psicology,
			},
		});

		if (!sheetCreated) throw new Error("📄 Este personaje ya tiene una ficha de rol.");

		const matchingCharacter = await Character.findOne({
			where: {
				[Op.or]: [{ ID: CharacterID }],
			},
		});

		if (!matchingCharacter) throw new Error("🔍 El CharacterID no es válido o no existe.");

		await matchingCharacter.setCharacter_Info(sheet);


		addLog(2, matchingCharacter.ID, null, `${matchingCharacter.name} ha creado su ficha de rol!`, false, true, 'Character role sheet created')

		return { message: `👌 La ficha del personaje ${matchingCharacter.name} ha sido creada correctamente.`, type: true, sheet: sheet, character: matchingCharacter };
	} catch (error) {
		throw new Error("❌ " + error.message);
	}
}


/// <=============== POST - UPDATE USER ===============>

async function updateSheet(
	ID,
	realAge,
	fisicalAge,
	sexOrientation,
	ocInfo,
	reputation,
	isDead,
	theme,
	history,
	extraData,
	fisicalDesc,
	Psicology,
) {
	//Si falta algun dato devolvemos un error
	if (!ID) throw new Error("Falta ID");


	const matchingSheet = await Character_Info.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		}
	});

	if (!matchingSheet) throw new Error("El personaje no existe");


	const updateThisSheet = await Character_Info.update(
		{
			realAge,
			fisicalAge,
			sexOrientation,
			ocInfo,
			reputation,
			isDead,
			theme,
			history,
			extraData,
			fisicalDesc,
			Psicology,
		},
		{
			where: { ID: ID },
		}
	);


	const updatedSheet = await Character_Info.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		},

	});

	if (!updatedSheet) throw new Error("El personaje no pudo ser creado");
	console.log(updatedSheet)



	return updatedSheet;
}





//   ||==============| Delete Character |===============ooo<>
// To delete a Sheet.
const deleteSheet = async (ID) => {
	const sheet = await Character_Info.findByPk(ID)

	if (!sheet) throw new Error("Character not found");

	await Character_Info.destroy({
		where: {
			ID: ID,
		},
	});

	return sheet;
}


module.exports = {
	getAllSheets, getSheetsById, createSheets, updateSheet, deleteSheet, getSheetByCharId
};