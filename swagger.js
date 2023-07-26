const swaggerOptions = {
	swaggerOptions: {
		defaultModelsExpandDepth: 1,
		docExpansion: 'list',
	},
	definition: {
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		openapi: "3.0.0",
		cors: true,
		info: {
			title: "Fiction RolePlay",
			version: "1.0.0",
			description: "Documentation for API",
		},
		servers: [
			{
				url: "http://localhost:3011", // Cambia la URL según la configuración de servidor
			},
		],
	},
	// Ruta o patrón para los archivos que contienen las rutas de tu API
	apis: [
		"./src/app.js",
		"./src/routes/user/UserCRUD.js",
		"./src/routes/topic/TopicsCRUD.js",
		"./src/routes/post/PostCRUD.js",
		"./src/routes/images/imagesImgurApi.js",
		"./src/routes/character/CharacterCRUD.js",
		"./src/routes/character/SheetsCRUD.js",
		"./src/routes/index.js",
	],
};

module.exports = swaggerOptions;
