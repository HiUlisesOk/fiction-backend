const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"Battle",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			roundID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			battleStatsID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			roundsCount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			Characters: {
				type: DataTypes.ARRAY,
				allowNull: false,
			},
			WinnerID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			paranoid: true,
		},
	);
};