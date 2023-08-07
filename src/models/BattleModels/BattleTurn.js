const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const BattleTurn = sequelize.define(
		"BattleTurn",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			CharID: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			objectiveID: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
				allowNull: true,
			},
			TurnResolved: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			TurnNumber: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			previusHP: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			currentHP: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			atk: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			def: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			heal: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			ilu: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			counter: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			paranoid: true,
		},
	);
	return BattleTurn
};