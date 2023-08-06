const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const BattleRounds = sequelize.define(
		"BattleRounds",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			Characters: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
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
	return BattleRounds
};