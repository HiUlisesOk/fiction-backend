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

	if (!roles.length) throw new Error("No se encontraron roles para el usuario");

	console.log(roles)
	const mapRoles = roles.map((role) => {
		return {
			rolename: role.rolename,
			value: role.value,
		};
	});
	//Si la funcion no recibe nada, devuelve un error.
	if (!roles) throw new Error("🔍 No se encontraron roles para el usuario");
	if (!mapRoles) throw new Error("👷🏻 - No se pudieron integrar las propiedades de los roles en un array");
	return mapRoles;
}

/// <=============== controller User has Role ===============>
async function userHasRole(id, rol) {
	const user = await User.findByPk(id);
	if (!user) throw new Error("El usuario no existe");

	const matchingRole = await Roles.findOne({
		where: {
			rolename: rol,
		},
	});

	if (!matchingRole) throw new Error("El rol que intentas encontrar en este usuario no existe");
	//Si la funcion no recibe nada, devuelve un error.

	const roles = await user.getRoles();
	if (!roles) throw new Error("No se encontraron roles para este usuario");

	const userHasRole = roles?.find((role) => role.ID === matchingRole.ID);

	if (userHasRole) return true;

	return false;
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
			value: rol,
		},
	});

	if (!matchingRole) throw new Error("El rol que intentas añadir no existe");
	//Si la funcion no recibe nada, devuelve un error.

	const userHasRole = roles?.find((role) => role.ID === matchingRole.ID);

	if (userHasRole) throw new Error("El usuario ya tiene ese rol");

	await findUser.addRole(matchingRole);
	return matchingRole;
}

/// <=============== controller CreateRol ===============>
// roleName: "user"
// value: 1
async function createRol(rolName, value) {
	const rol = await Roles.findOne({ where: { rolename: rolName, value: value } });

	if (rol) throw new Error("El rol ya existe y su id es: " + rol.ID);

	const rolCreated = await Roles.create({ rolename: rolName, value: value });

	//Si la funcion no recibe nada, devuelve un error.
	if (!rolCreated) throw new Error("No se pudo crear el rol");
	console.log(rolCreated)
	return rolCreated;
}

/// <=============== controller rolExist ===============>
async function rolExist(rolName, value) {
	const rol = await Roles.findOne({ where: { rolename: rolName, value: value } });
	return rol ? true : false;
}


module.exports = {
	getRolesFromUserID,
	addRol,
	userHasRole,
	rolExist,
	createRol
};
