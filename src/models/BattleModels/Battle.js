const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const Battle = sequelize.define(
		"Battle",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			Chars: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				allowNull: false,
			},
			WinnerID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			LoserID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			paranoid: true,
		},
	);
	return Battle
};