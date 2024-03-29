const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const User = sequelize.define(
		"User",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			profilePicture: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "https://via.placeholder.com/500x500",
			},
			profileBanner: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "https://via.placeholder.com/1344x384",
			},
			birthDate: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			bio: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'Pass.001',
			},
			userScore: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
		},
		{
			paranoid: true,
		},
	);
	return User;
};