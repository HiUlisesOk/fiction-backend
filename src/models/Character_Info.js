const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"Character_Info",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			realAge: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			fisicalAge: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			sexOrientation: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ocInfo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			reputation: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			isDead: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			theme: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			history: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			extraData: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			fisicalDesc: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			Psicology: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			paranoid: true,
		},
	);
};