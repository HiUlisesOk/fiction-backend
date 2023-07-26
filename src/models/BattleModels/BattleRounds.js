const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	sequelize.define(
		"BattleRounds",
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
			Characters: {
				type: DataTypes.ARRAY,
				allowNull: false,
			},
			WinnerID: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		},
	);
};