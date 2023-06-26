function convertImageToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			resolve(reader.result);
		};

		reader.onerror = () => {
			reject(new Error('Error al leer la imagen.'));
		};

		reader.readAsDataURL(file);
	});
}

module.exports = convertImageToBase64;