
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

/// <=============== controller getAllLogs ===============>
async function getAllLogs() {
	const log = await ActionLog.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!log) throw new Error("No se encontraron logs");

	return log;
}

/// <=============== controller getAllUsers ===============>
async function getLastLogs() {
	const log = await ActionLog.findAll({
		limit: 15, // Obtener solo los últimos 15 registros
		order: [['createdAt', 'DESC']], // Ordenar por fecha de creación de manera descendente
	});
	//Si la funcion no recibe nada, devuelve un error.
	if (!log) throw new Error("No se encontraron logs");

	return log;
}

/// <=============== controller getAllUsers ===============>
// action_type:

// addLog(1, ID, characterID, `${username} ahora tiene una foto de perfil increible!`, false, true,'Profile picture updated', username )
async function addLog(action_type, ID, target_id, info, onlyAdmins, isActive, action_desc, name) {

	console.log(ID)
	const user = await User.findOne({ where: { ID: ID } })
	if (!user) throw new Error('No username')
	console.log(user)
	const log = await ActionLog.create({
		user_id: ID || null,
		name: name || user.username || null,
		action_type: action_type || null,
		action_desc: action_desc || null,
		target_id: target_id || ID,
		avatar: user?.profilePicture || null,
		info: info || null,
		onlyAdmins: onlyAdmins || false,
		isActive: isActive || null,
	}
	);

	return log;
}



module.exports = {
	getAllLogs,
	getLastLogs,
	addLog,
};
