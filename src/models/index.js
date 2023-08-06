// models/index.js
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(
	`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
	{
		logging: false,
		native: false,
	}
);

const User = require("./UserModels/User")(sequelize);
const Topic = require("./UserModels/Topic")(sequelize);
const Post = require("./UserModels/Post")(sequelize);
const Character = require("./CharacterModels/Character")(sequelize);
const CharacterStats = require("./CharacterModels/CharacterStats")(sequelize);
const Character_Info = require("./CharacterModels/Character_Info")(sequelize);
const Character_skills = require("./CharacterModels/Character_skills")(sequelize);

// Define las relaciones aquí, si es necesario

// Exporta los modelos y la conexión
module.exports = {
	User,
	Topic,
	Post,
	Character,
	CharacterStats,
	Character_Info,
	Character_skills,
	conn: sequelize,
};
