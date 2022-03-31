const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;
const randomString = require('randomstring');
const { Type } = require('../../activeCodeModel/constants/codeType.constant');

module.exports = async function (ctx) {
	try {
		const { email } = ctx.params.body;

		const user = await this.broker.call('UserModel.findOne', [{ email }]);
		if (!user)
			throw new MoleculerClientError('Email or password is invalid!', 422, '', [
				{ field: 'email', message: 'is not found' },
			]);

		await this.broker.call('ActiveCodeModel.deleteMany', [
			{ email, type: Type.FORGOT_PASSWORD },
		]);

		const code = randomString.generate({
			length: 10,
			charset: 'alphanumeric',
		});

		const expired = new Date();
		expired.setHours(expired.getHours() + 1);

		const forgotPasswordCode = await this.broker.call(
			'ActiveCodeModel.create',
			[{ email, code, expired, type: Type.FORGOT_PASSWORD }]
		);

		if (forgotPasswordCode._id) {
			await this.broker.call('Mail.send', {
				to: email,
				subject: 'Forgot Password',
				text: `Your code is ${code}`,
			});
		}
		return { message: 'Request forgot password successfully' };
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
