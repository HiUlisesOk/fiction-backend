// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op, where } = require("sequelize");
const { User, Post, Topic, Roles } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const bcrypt = require('bcrypt');
const { uploadImage } = require('../imagesControllers')


/// <=============== controller getRolesFromUserID ===============>
async function getRolesFromUserID(id) {
	const user = await User.findByPk(id);

	if (!user) throw new Error("El usuario no existe");

	const roles = await user.getRoles();

	console.log(roles)
	//Si la funcion no recibe nada, devuelve un error.
	if (!roles) throw new Error("No se encontraron roles para el usuario");
	return roles;
}

/// <=============== controller addRol ===============>
async function addRol(rol, userID) {
	if (!rol) throw new Error("Falta rol");
	if (!userID) throw new Error("Falta userID");

	const findUser = await User.findByPk(userID);

	if (!findUser) throw new Error("El usuario no existe");

	const roles = await findUser.getRoles();

	const matchingRole = await Roles.findOne({
		where: {
			ID: rol,
		},
	});

	if (!matchingRole) throw new Error("El rol que intentas añadir no existe");
	//Si la funcion no recibe nada, devuelve un error.


	const userHasRole = roles?.find((role) => role.ID === matchingRole.ID);

	if (userHasRole) throw new Error("El usuario ya tiene ese rol");

	await findUser.addRole(matchingRole);
	return matchingRole;
}

module.exports = {
	getRolesFromUserID,
	addRol,

};
