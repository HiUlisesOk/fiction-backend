const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"Character_Stats",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			level: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			diceName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			diceID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			diceName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			diceValue: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			EXP: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			HP: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			STR: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			AGI: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			INT: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			RES: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			CHARM: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			WIS: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			}
		},
		{
			paranoid: true,
		},
	);
};