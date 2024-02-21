// /// =========================================================================== ///
// /// =============================== CONTROLLERS USERS ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/ 
//         \|  

const { Op, where } = require("sequelize");
const { User, Post, Topic } = require("../../db");
const { generateDateOnly, generateDateTime } = require('../../utils/date')
const { createPost, getPostByTopicId } = require('./PostControllers')
const bcrypt = require('bcrypt');
const { addLog } = require("../Logs/LogsControllers");
const { sequelize } = require("../../db");

/// <=============== controller getTopicById ===============>
async function getTopicsById(id) {
	if (!id) throw new Error("No se recibió un Topic en el payload");

	const topic = await Topic.findByPk(id);
	if (!topic) throw new Error("Topic not Found");

	const posts = await getPostByTopicId(id);

	if (!posts) throw new Error("Posts not Found");

	return { topic, posts };
}

/// <=============== controller getTopicByUserID ===============>
async function getTopicsByUserId(userID) {
	if (!userID) throw new Error("No se recibió un userID en el payload");

	const topic = await Topic.findAll({
		where: { authorID: userID },
		raw: true,
		include: [
			{
				model: User,
				attributes: ['profilePicture', 'username'],
				// where: sequelize.literal('"User"."ID" = "Topic"."authorID"'),
				required: false,
			},
		],
	});

	if (!topic) throw new Error("Topic not Found");

	const cleanTopic = topic?.map(item => {
		return {
			ID: item?.ID,
			title: item?.title,
			author: item?.author,
			authorID: item?.authorID,
			postCount: item?.postCount,
			lastAuthor: item?.lastAuthor,
			lastAuthorID: item?.lastAuthorID,
			createdAt: item?.createdAt,
			updatedAt: item?.updatedAt,
			deletedAt: item?.deletedAt,
			avatar: item['Users.profilePicture']
		}
	})

	return cleanTopic || topic;
}

/// <=============== controller getLastActiveTopics ===============>
async function getLastActiveTopics() {

	const lastActiveTopics = await Topic.findAll({
		order: [['updatedAt', 'DESC']],
		group: ['ID'],
		limit: 10,
		raw: true,
		include: [
			{
				model: User,
				attributes: ['profilePicture', 'username'],
				required: false,
			},
		],
	});

	if (!lastActiveTopics) throw new Error("No se encontraron Topics");

	const getPosts = await Promise.all(lastActiveTopics.map(async (topic) => {
		return await Post.findAll({
			where: {
				topicID: topic.ID,
				authorID: topic.authorID,
			},
		});
	}));


	const postValues = getPosts.map((post, index) => {
		return post.map((data, index) => {
			return data.dataValues
		});
	}).flat();



	const topicsWithContentOfFirstPost = lastActiveTopics.map((topic, index) => {
		return {
			...topic,
			content: postValues[index].content,
		};
	});
	console.log('topicsWithContentOfFirstPost: ', topicsWithContentOfFirstPost)
	const cleanTopic = topicsWithContentOfFirstPost?.map(item => {
		return {
			ID: item?.ID,
			title: item?.title,
			author: item && item['Users.username'],
			authorID: item?.authorID,
			avatar: item && item['Users.profilePicture'],
			image: item?.image || "/landingPage/landingPageBackground.jpg",
			description: item?.content,
			numberOfPosts: item?.postCount,
			createdAt: item?.createdAt,
			updatedAt: item?.updatedAt,
		}
	});

	const topicsResult = [...cleanTopic]

	return topicsResult;
}


/// <=============== controller getAllTopicsFromDb ===============>
async function getAllTopicsFromDb() {

	const topics = await Topic.findAll({
		raw: true,
		include: [
			{
				model: User,
				attributes: ['profilePicture', 'username'],
				// where: sequelize.literal('"User"."ID" = "Topic"."authorID"'),
				required: false,
			},
		],
	});


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

	const log = await addLog(1, authorID, null, `ha creado el topic ${topic.title}`, true, true, 'New Topic')
	if (!log) throw new Error("No log");

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

	const user = await User.findOne({ where: { ID: authorID } });
	if (!user) throw new Error("El autor no existe");
	if (!user.ID) throw new Error("El autor no existe");

	const log = await addLog(1, authorID, null, `ha editado el topic ${updatedTopic.title}`, true, true, 'Topic Updated')
	if (!log) throw new Error("No log");

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

	const user = await User.findOne({ where: { ID: ID } });
	if (!user) throw new Error("El autor no existe");
	if (!user.ID) throw new Error("El autor no existe");

	const log = await addLog(1, authorID, null, `ha eliminado el topic ${topic.title}`, true, true, 'Topic deleted')
	if (!log) throw new Error("No log");

	return topic;
}

module.exports = {
	CreateTopic,
	getAllTopicsFromDb,
	getTopicsById,
	getTopicsByUserId,
	getLastActiveTopics,
	updateTopic,
	deleteTopic
}