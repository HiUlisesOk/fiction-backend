const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"BattleTurn",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			battleID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			battleRound: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			CharID: {
				type: DataTypes.ARRAY,
				allowNull: false,
			},
			turnNumber: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			atk: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			atk: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			def: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			heal: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			ilu: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		},
	);
};