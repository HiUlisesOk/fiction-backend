const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const Character = sequelize.define(
		"Character",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			guildName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			guildID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "https://via.placeholder.com/500x500",
			},
			charge: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			rank: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			paranoid: true,
		},
	);
	return Character
};