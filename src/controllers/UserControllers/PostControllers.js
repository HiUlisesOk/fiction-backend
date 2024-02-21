// /// =========================================================================== ///
// /// =============================== CONTROLLERS POST ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/
//         \|

const { Op } = require("sequelize");
const { User, Post, Topic } = require("../../db");
const { generateDateOnly, generateDateTime } = require("../../utils/date");
const bcrypt = require("bcrypt");
const { addLog } = require("../Logs/LogsControllers");
const { getUserFromDb } = require("./UserControllers");

/// <=============== GET ALL POST ===============>
async function getAllPostFromDb() {
  // Guardamos los datos de la API en data
  const posts = await Post.findAll();
  //Si la funcion no recibe nada, devuelve un error.
  if (!posts) throw new Error("No se encontraron usuarios");
  return posts;
}

/// <=============== controller getPostById ===============>
async function getPostById(id) {
  if (!id) throw new Error("No se recibió un Post ID en el payload");

  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post not Found");
  return post;
}


/// <=============== controller getPostByTopicId ===============>
async function getPostByTopicId(topicId) {
  if (!topicId) throw new Error("No se recibió un Topic ID en el payload");

  const posts = await Post.findAll({ where: { TopicID: topicId } });
  if (!posts) throw new Error("Topic not Found");
  return posts;
}

/// <=============== controller getPostByUserID ===============>
async function getTopicsByUserId(userID) {
  if (!userID) throw new Error("No se recibió un userID en el payload");

  const posts = await Post.findAll({ where: { authorID: userID } });
  if (!posts) throw new Error("Topic not Found");
  return posts;
}

/// <=============== CREATE POST ===============>
const createPost = async (
  content,
  authorID,
  topicID
) => {
  // console.log(content, authorID, topicID);
  //Si falta algun dato devolvemos un error
  if (!content) throw new Error("Falta content");
  if (!authorID) throw new Error("Falta Author");
  if (!topicID) throw new Error("Falta Topic");

  const user = await User.findOne({ where: { ID: authorID } });
  if (!user) throw new Error("El autor no existe");

  const topic = await Topic.findOne({ where: { ID: topicID } });
  if (!topic) throw new Error("El topic no existe");
  if (!topic.ID) throw new Error("El autor no tiene ID");

  const [post, postCreated] = await Post.findOrCreate({
    where: {
      content: content,
      author: user.username,
      authorID: user.ID,
      topicID: topic.ID,
    },
  });
  console.log("topicCreated: ", topic);

  if (!post.author) throw new Error("El autor del post es nulo");
  if (!authorID) throw new Error("El ID del autor es nulo");

  await topic.addPost(post);
  await topic.update({
    postCount: topic.postCount + 1,
    lastAuthor: post.author,
    lastAuthorID: authorID
  });

  const newPost = {
    author: user.username,
    content: content,
    topicID: topic.ID,
  };
  await addLog(1, user.ID, null, `ha posteado en ${topic.title}`, false, true, 'New Topic')
  return newPost;
};

/// <=============== UPDATE POST ===============>

const updatePost = async (
  content,
  authorID,
  postID,
  topicID
) => {
  const matchingPost = await Post.findOne({
    where: {
      authorID: authorID,
      topicID: topicID,
      ID: postID,
    },
  });

  if (!matchingPost) {
    throw new Error("No se encontró el post correspondiente");
  }

  const updatedPost = await matchingPost.update({
    content: content,
  });
  await addLog(1, authorID, null, `editó su post ${postID} en el topic ${topicID}`, false, true, 'Post Updated')
  return updatedPost;
};

/// <=============== DELETE POST ===============>

const deletePost = async (authorID) => {
  const post = await Post.findByPk(authorID);
  const user = await getUserFromDb(post.authorID)
  console.log('user: ', user, post.authorID)
  await post.destroy({
    where: {
      ID: authorID,
    },
  });
  if (!user) throw new Error("No user ID");
  const log = await addLog(1, post.authorID, null, `ha borrado el post Nro ${post.topicID}`, true, true, 'Post Deleted')
  if (!log) throw new Error("No log");
  console.log(log)
  return post;
};

module.exports = { createPost, getAllPostFromDb, updatePost, deletePost, getTopicsByUserId, getPostByTopicId, getPostById };
