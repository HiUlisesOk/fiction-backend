const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	const ActionLog = sequelize.define(
		"ActionLog",
		{
			ID: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			action_type: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			action_desc: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			target_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
				defaultValue: "https://via.placeholder.com/500x500",
			},
			info: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			onlyAdmins: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
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
	return ActionLog
};