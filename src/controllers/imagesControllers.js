//   ||==============| Generate Access Token |===============ooo<>
// Given a user's refresh token, this endpoint generates an access token.

var axios = require('axios');
var FormData = require('form-data');

function generateAccessToken() {
	var data = new FormData();
	data.append('refresh_token', process.env.refreshToken);
	data.append('client_id', process.env.clientId);
	data.append('client_secret', process.env.clientSecret);
	data.append('grant_type', 'refresh_token');

	var config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://api.imgur.com/oauth2/token',
		headers: {
			...data.getHeaders()
		},
		data: data
	};

	const result = axios(config)
		.then(function (response) {
			const token = response.data.access_token
			console.log(token);
			// Aquí puedes realizar las acciones necesarias con el access token obtenido
			return token
		})
		.catch(function (error) {
			console.log(error);
		});
	return result
}

//   ||==============| Upload Image |===============ooo<>
// Given a user's refresh token, this endpoint generates an access token.
async function uploadImage(imagen64) {
	var axios = require('axios');
	var FormData = require('form-data');
	var data = new FormData();
	data.append('image', imagen64);

	var config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://api.imgur.com/3/image',
		headers: {
			'Authorization': `Client-ID ${process.env.clientId}`,
			...data.getHeaders()
		},
		data: data
	};

	return new Promise((resolve, reject) => {
		axios(config)
			.then(function (response) {
				resolve(response.data.data.link);
			})
			.catch(function (error) {
				reject(error);
			});
	});
}


module.exports = { generateAccessToken, uploadImage };
