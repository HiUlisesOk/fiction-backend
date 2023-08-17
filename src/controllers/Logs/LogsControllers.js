
//   ____ ____ ____ ____ _________ ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ 
//  ||L |||o |||g |||s |||       |||C |||o |||n |||t |||r |||o |||l |||l |||e |||r |||s ||
//  ||__|||__|||__|||__|||_______|||__|||__|||__|||__|||__|||__|||__|||__|||__|||__|||__||
//  |/__\|/__\|/__\|/__\|/_______\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|


const { Op } = require("sequelize");
const {
	User,
	Post,
	Topic,
	Character,
	CharacterStats,
	Battle,
	BattleStats,
	BattleRounds,
	BattleTurn,
	ActionLog,
} = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers')

const { rollDice } = require("../../utils/rollDice");

/// <=============== controller getAllUsers ===============>
async function getAllLogs() {
	const log = await ActionLog.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!log) throw new Error("No se encontraron usuarios");
	return log;
}

/// <=============== controller getAllUsers ===============>
// action_type:
// 1 = User
// 2 = Character
// addLog(1, ID, null, `${username} ahora tiene una foto de perfil increible!`, false, true)
async function addLog(action_type, userID, target_id, info, onlyAdmins, isActive) {

	if (action_type === 1) {
		const user = await User.findOne({ were: { ID: userID } })

		const log = await ActionLog.create({
			user_id: userID || null,
			action_type: action_type || null,
			target_id: target_id || null,
			avatar: user.avatar || null,
			info: info || null,
			onlyAdmins: onlyAdmins || null,
			isActive: isActive || null,
		}
		);
	} else if (action_type === 2) {
		const character = await Character.findOne({ were: { ID: userID } })

		const log = await ActionLog.create({
			user_id: userID || null,
			action_type: action_type || null,
			target_id: target_id || null,
			avatar: character.avatar || null,
			info: info || null,
			onlyAdmins: onlyAdmins || null,
			isActive: isActive || null,
		}
		);
	}
}

// /// <=============== controller getUSER ===============>
// async function getUserFromDb(userID) {
// 	const matchingUser = await User.findOne({
// 		where: {
// 			ID: userID,
// 		},
// 	});

// 	if (!matchingUser) throw new Error("El usuario no existe");
// 	//Si la funcion no recibe nada, devuelve un error.
// 	return matchingUser;
// }

module.exports = {
	getAllLogs,
	addLog,
};
