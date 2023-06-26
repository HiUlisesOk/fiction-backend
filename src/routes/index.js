const { Router } = require("express");
const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const userRouter = require("./user/UserCRUD");
const postRouter = require('./post/PostCRUD')
const TopicRouter = require('./topic/TopicsCRUD')
const imagesImgurAPI = require('./images/imagesImgurApi')
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use(userRouter);

router.use(TopicRouter);

router.use(postRouter);

router.use(imagesImgurAPI);



module.exports = router;
