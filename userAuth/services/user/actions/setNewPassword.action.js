const { Type } = require('../../activeCodeModel/constants/codeType.constant');

const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { email, password, code } = ctx.params.body;

		const token = await this.broker.call('ActiveCodeModel.findOne', [
			{ email, code, expired: { $gt: new Date() }, type: Type.FORGOT_PASSWORD },
		]);

		if (!token) {
			throw new MoleculerClientError('Email or code is invalid!', 422, '', [
				{ field: 'email', message: 'is invalid' },
				{ field: 'code', message: 'is invalid' },
			]);
		}

		const updatedUser = await this.broker.call('UserModel.findOneAndUpdate', [
			{ email },
			{ password: password },
		]);

		await this.broker.call('ActiveCodeModel.delete', [
			{ email, type: Type.FORGOT_PASSWORD },
		]);

		if (updatedUser) {
			return { message: 'Reset password successfully' };
		}
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
