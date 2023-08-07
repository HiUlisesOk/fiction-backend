const { expect } = require('chai');
const { conn } = require('../../src/db');
const User = require('../../src/models/UserModels/User');
const AuthLogin = require('../../src/controllers/UserControllers/UserControllers');

describe('User model', () => {
	before(async () => {
		// Conectar a la base de datos de prueba
		await conn.authenticate();
	});

	after(async () => {
		// Desconectar de la base de datos de prueba
		await conn.close();
	});

	beforeEach(async () => {
		// Sincronizar los modelos con la base de datos de prueba
		await conn.sync({ force: true });
	});

	it('should create a new user', async () => {
		// Crear un nuevo usuario en la base de datos de prueba
		const user = await User.create({ name: 'John Doe', email: 'johndoe@example.com' });

		// Buscar el usuario en la base de datos de prueba
		const foundUser = await User.findOne({ where: { email: 'johndoe@example.com' } });

		expect(foundUser).to.not.be.null;
		expect(foundUser.name).to.equal('John Doe');
	});
});


describe('AuthLogin', () => {
	it('should throw an error if email is not provided', async () => {
		try {
			await AuthLogin(null, 'password');
		} catch (error) {
			expect(error).to.be.an('error');
			expect(error.message).to.equal('email is required');
		}
	});

	it('should throw an error if password is not provided', async () => {
		try {
			await AuthLogin('email@example.com', null);
		} catch (error) {
			expect(error).to.be.an('error');
			expect(error.message).to.equal('password is required');
		}
	});

	it('should throw an error if user email is not found', async () => {
		try {
			await AuthLogin('nonexistent@example.com', 'password');
		} catch (error) {
			expect(error).to.be.an('error');
			expect(error.message).to.equal('User email not found');
		}
	});

	it('should return an object with passwordsMatch and user properties if authentication is successful', async () => {
		const result = await AuthLogin('email@example.com', 'password');

		expect(result).to.be.an('object');
		expect(result).to.have.property('passwordsMatch');
		expect(result).to.have.property('user');
	});
});