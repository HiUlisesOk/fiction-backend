const { Router } = require("express");
const router = Router();
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const userRouter = require("./user//UserCRUD");
const postRouter = require('./post/PostCRUD')
const TopicRouter = require('./topic/TopicsCRUD')
const imagesImgurAPI = require('./images/imagesImgurApi')
const characterRouter = require('./character/CharacterCRUD')
const sheetRouter = require('./character/SheetsCRUD')
const skillsRouter = require('./character/SkillsCRUD')
const statsRouter = require('./character/StatsCRUD')
const battleRouter = require('./battle/battleEndpoints')

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use(userRouter);

router.use(TopicRouter);

router.use(postRouter);

router.use(imagesImgurAPI);

router.use(characterRouter);

router.use(sheetRouter)

router.use(skillsRouter)

router.use(statsRouter)

router.use(battleRouter)

module.exports = router;


