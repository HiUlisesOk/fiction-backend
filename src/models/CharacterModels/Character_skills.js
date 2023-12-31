const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const Character_skills = sequelize.define(
		"Character_skills",
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
			desc: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			paranoid: true,
		},
	);

	return Character_skills
};