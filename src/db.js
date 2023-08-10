const { Sequelize, DataTypes } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
  }
);

// Aquí importamos los modelos y los definimos en la conexión sequelize

const User = require("./models/UserModels/User")(sequelize);
const Topic = require("./models/UserModels/Topic")(sequelize);
const Post = require("./models/UserModels/Post")(sequelize);
const Character = require("./models/CharacterModels/Character")(sequelize);
const CharacterStats = require("./models/CharacterModels/CharacterStats")(sequelize);
const Character_Info = require("./models/CharacterModels/Character_Info")(sequelize);
const Character_skills = require("./models/CharacterModels/Character_skills")(sequelize);
const Battle = require('./models/BattleModels/Battle')(sequelize);
const BattleRounds = require('./models/BattleModels/BattleRounds')(sequelize);
const BattleStats = require('./models/BattleModels/BattleStats')(sequelize);
const BattleTurn = require('./models/BattleModels/BattleTurn')(sequelize);
const ActionLog = require('./models/Logs/ActionsLogs')(sequelize);

// Definimos las relaciones entre los modelos
User.belongsToMany(Topic, { through: "UserTopics" });
User.hasMany(Post);
User.hasMany(Character);

Topic.belongsToMany(User, { through: "UserTopics" });
Topic.hasMany(Post);

Post.belongsTo(User);
Post.belongsTo(Topic);

// ...

Character.belongsTo(User);
Character.belongsToMany(Battle, { through: "CharBattle" });
Character.hasMany(BattleStats);
Character.hasOne(CharacterStats);
Character.hasOne(Character_Info);
Character.hasOne(Character_skills);


CharacterStats.belongsTo(Character);
Character_Info.belongsTo(Character);
Character_skills.belongsTo(Character);

Battle.belongsToMany(Character, { through: "CharBattle" });
Battle.hasMany(BattleStats);
Battle.hasMany(BattleRounds);
Battle.hasMany(BattleTurn);

BattleStats.belongsTo(Battle);
BattleStats.belongsTo(Character);
BattleStats.hasMany(BattleRounds);
BattleStats.hasMany(BattleTurn);


BattleRounds.hasOne(Battle);
BattleRounds.hasMany(BattleTurn);
BattleRounds.hasOne(Character);
BattleRounds.hasMany(BattleStats);

BattleTurn.belongsTo(Battle);
BattleTurn.belongsTo(BattleRounds);
BattleTurn.belongsTo(Character);
BattleTurn.belongsTo(BattleStats);

// ...


// Exportamos los modelos y la conexión
module.exports = {
  User,
  Topic,
  Post,
  Character,
  CharacterStats,
  Character_Info,
  Character_skills,
  BattleStats,
  Battle,
  BattleRounds,
  BattleTurn,
  ActionLog,
  conn: sequelize,
};
