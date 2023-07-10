// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op } = require("sequelize");
const { User, Post, Topic } = require("../db");
const { generateDateOnly, generateDateTime } = require('../utils/date')
const { createPost } = require('../controllers/PostControllers')
const bcrypt = require('bcrypt');


/// <=============== controller getAllRecipes ===============>
async function getAllTopicsFromDb() {
	// Guardamos los datos de la API en data
	const topics = await Topic.findAll();
	//Si la funcion no recibe nada, devuelve un error.
	if (!topics) throw new Error("No se encontraron Topics");
	return topics;
}


/// <=============== controller Create Topics ===============>
const CreateTopic = async (title, authorID, content) => {

	//Si falta algun dato devolvemos un error
	if (!title) throw new Error("Falta Title");

	if (!authorID) throw new Error("Falta AuthorID");

	const user = await User.findOne({ where: { ID: authorID } });
	if (!user) throw new Error("El autor no existe");
	if (!user.ID) throw new Error("El autor no existe");

	const [topic, topicCreated] = await Topic.findOrCreate({
		where: {
			title: title,
			author: user.username,
			authorID: user.ID,
		},
	});
	console.log('topicCreated: ', topicCreated, topic)

	await user.addTopic(topic);

	const newPost = await createPost(content, authorID, topic.dataValues.ID)

	return { topic, newPost };
}


/// <=============== UPDATE TOPIC ===============>

const updateTopic = async (authorID, topicID, title) => {
	const matchingTopic = await Topic.findOne({
		where: {
			authorID: authorID,
			ID: topicID,
		}
	});

	if (!matchingTopic) {
		throw new Error("No se encontró el topic correspondiente");
	}

	const updatedTopic = await matchingTopic.update({
		title: title,
	});

	return updatedTopic;
};

/// <=============== DELETE POST ===============>

const deleteTopic = async (ID) => {
	const topic = await Topic.findByPk(ID)
	if (!topic) throw new Error("El topic no existe");
	await topic.destroy({
		where: {
			ID: ID,
		},
	});

	return topic;
}

module.exports = {
	CreateTopic,
	getAllTopicsFromDb,
	updateTopic,
	deleteTopic
}