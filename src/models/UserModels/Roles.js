const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const Roles = sequelize.define(
		"Roles",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			rolename: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "user",
			},
			value: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		},
	);
	return Roles;
};