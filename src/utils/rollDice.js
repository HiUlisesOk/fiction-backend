// This function generates a random number between 1 and the diceValue specified as a parameter
// It assumes the diceValue is a positive integer
function rollDice(diceValue) {
	if (diceValue <= 0 || !Number.isInteger(diceValue)) {
		// Generate a random number between 0 and diceValue - 1 (both included)
		const randomNumber = Math.floor(Math.random() * 6);

		// Add 1 to the random number to get a result between 1 and diceValue
		return randomNumber + 1;
	} else {
		const randomNumber = Math.floor(Math.random() * diceValue);

		// Add 1 to the random number to get a result between 1 and diceValue
		return randomNumber + 1;
	}
}

module.exports = {
	rollDice
};
