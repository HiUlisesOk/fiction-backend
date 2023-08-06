// /// =========================================================================== ///
// /// =============================== CONTROLLERS Skills ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic, Character, CharacterStats, Character_Info, Character_skills } = require("../../db");
const bcrypt = require('bcrypt');



/// <=============== controller getAllSkills ===============>
async function getAllSkills() {
	const skills = await Character_skills.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!skills) throw new Error("No se encontraron habilidades");
	return skills;
}

/// <=============== controller getCharacter ===============>
async function getSkillsById(ID) {
	const matchingSkills = await Character_skills.findByPk(ID);

	if (!matchingSkills) throw new Error("La habilidad no existe");
	//Si la funcion no recibe nada, devuelve un error.
	return matchingSkills;
}

/// <=============== controller createSkills ===============>
async function createSkills(
	name,
	desc,
	type,
	CharacterID,
) {
	if (!name) throw new Error("Falta name");
	if (!desc) throw new Error("Falta desc");
	if (!type) throw new Error("Falta type");
	if (!CharacterID) throw new Error("Falta CharacterID");


	try {
		const [skill, sheetCreated] = await Character_skills.findOrCreate({
			where: {
				name,
				desc,
				type,
			},
		});

		if (!sheetCreated) throw new Error("La habilidad no pudo ser creada.");

		const matchingCharacter = await Character.findOne({
			where: {
				[Op.or]: [{ ID: CharacterID }],
			},
		});

		if (!matchingCharacter) throw new Error("El CharacterID no es válido o no existe.");

		await matchingCharacter.setCharacter_skills(skill);


		return { message: `La  habilidad de ${matchingCharacter.name} ha sido creada correctamente.`, type: true, skill: skill, character: matchingCharacter };
	} catch (error) {
		throw new Error("Error al crear la ficha de rol del habilidad. " + error.message);
	}
}


/// <=============== POST - UPDATE USER ===============>

async function updateSkills(
	ID,
	name,
	desc,
	type,
) {
	//Si falta algun dato devolvemos un error
	if (!ID) throw new Error("Falta ID");


	const matchingSheet = await Character_skills.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		}
	});

	if (!matchingSheet) throw new Error("La habilidad no existe");


	const updateThisSheet = await Character_skills.update(
		{
			name,
			desc,
			type,
		},
		{
			where: { ID: ID },
		}
	);


	const updatedSheet = await Character_skills.findOne({
		where: {
			[Op.or]: [{ ID: ID }],
		},

	});

	if (!updatedSheet) throw new Error("La habilidad no pudo ser creada");
	console.log(updatedSheet)



	return updatedSheet;
}





//   ||==============| Delete Character |===============ooo<>
// To delete a Sheet.
const deleteSkill = async (ID) => {
	const skill = await Character_skills.findByPk(ID)

	if (!skill) throw new Error("Skill not found");

	await Character_skills.destroy({
		where: {
			ID: ID,
		},
	});

	return skill;
}


module.exports = {
	getAllSkills, getSkillsById, createSkills, updateSkills, deleteSkill
};