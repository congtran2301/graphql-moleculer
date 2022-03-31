const bcrypt = require('bcryptjs');
const randomString = require('randomstring');
const _ = require('lodash');
const { Type } = require('../../activeCodeModel/constants/codeType.constant');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		let entity = ctx.params.input;

		if (entity.email) {
			const found = await this.broker.call('UserModel.findOne', [
				{ email: entity.email },
			]);
			if (found)
				throw new MoleculerClientError('Email is exist!', 422, '', [
					{ field: 'email', message: 'is exist' },
				]);
		}
		if (entity.phone) {
			const found = await this.broker.call('UserModel.findOne', [
				{ phone: entity.phone },
			]);
			if (found)
				throw new MoleculerClientError('Phone is exist!', 422, '', [
					{ field: 'phone', message: 'is exist' },
				]);
		}

		const user = await this.broker.call('UserModel.create', [entity]);

		await this.broker.call('WalletModel.create', [{ userId: user.id }]);

		const code = randomString.generate({
			length: 10,
			charset: 'alphanumeric',
		});

		const expired = new Date();
		expired.setHours(expired.getHours() + 99999);

		const activeCode = await this.broker.call('ActiveCodeModel.create', [
			{
				email: entity.email,
				userId: user.id,
				code,
				expired,
				type: Type.ACTIVE_ACCOUNT,
			},
		]);

		if (activeCode._id) {
			await this.broker.call('Mail.send', {
				to: entity.email,
				subject: 'Active Account',
				text: `Active your account http://localhost:5000/user/active-account/?code=${code}&userId=${user.id}`,
			});
		}
		return {
			message:
				'Register successfully, please check your email to active the account',
		};
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
