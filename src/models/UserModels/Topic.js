const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const Topic = sequelize.define(
		"Topic",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			author: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			authorID: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			postCount: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			lastAuthor: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastAuthorID: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			image: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "https://via.placeholder.com/112x240",
			},
		},
		{
			paranoid: true,
		},
	);

	return Topic;
};