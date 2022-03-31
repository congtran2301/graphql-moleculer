const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { email, password } = ctx.params.body;

		const adminUser = await this.broker.call('AdminModel.findOne', [{ email }]);

		if (!adminUser)
			throw new MoleculerClientError('Email or password is invalid!', 422, '', [
				{ field: 'email', message: 'is invalid' },
				{ field: 'password', message: 'is invalid' },
			]);

		const res = await bcrypt.compare(password, adminUser.password);
		if (!res)
			throw new MoleculerClientError('Wrong password!', 422, '', [
				{ field: 'password', message: 'wrong password' },
			]);

		const now = Date.now();

		const adminToken = await this.broker.call('AdminTokenModel.create', [
			{
				email,
				userId: adminUser.id,
				expiredTime: now + 1000 * 60 * 60 * 24 * 70,
				createdTime: now,
			},
		]); // 1 week

		const accessToken = this.generateJWT({
			adminId: adminUser.id,
			email: adminUser.email,
			adminTokenId: adminToken.id,
		});

		return {
			adminUser: _.omit(adminUser, ['password', '__v']),
			accessToken,
		};
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
