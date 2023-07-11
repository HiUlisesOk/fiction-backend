// Genera una fecha en el formato YYYY-MM-DD
const generateDateOnly = () => {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const day = String(currentDate.getDate()).padStart(2, '0');
	const dateOnly = `${year}-${month}-${day}`;
	return dateOnly;
};

// Generar una fecha y hora en formato ISO 8601
const generateDateTime = () => {
	const currentDateTime = new Date();
	const isoDateTime = currentDateTime.toISOString();
	return isoDateTime;
};

//Transforma las fechas de la DB a formato legible
function toDate(fecha) {
	const fechaOriginal = new Date(fecha);
	const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
	const fechaFormateada = fechaOriginal.toLocaleDateString('es-ES', options);

	return fechaFormateada;
}




module.exports = { generateDateOnly, generateDateTime, toDate }