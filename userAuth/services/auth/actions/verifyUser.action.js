const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const tokenPayload = ctx.params;

		if (!tokenPayload) {
			throw new MoleculerClientError('Token is not valid!', 422, '', [
				{ field: 'token', message: 'is not valid' },
			]);
		}

		const userToken = await this.broker.call('UserTokenModel.findOne', [
			{
				id: tokenPayload.userTokenId,
				isDisabled: { $ne: true },
			},
		]);

		if (
			!userToken ||
			userToken.expiredTime < new Date() ||
			userToken.logoutTime
		) {
			throw new MoleculerClientError(
				'Thông tin xác thực không hợp lệ hoặc đã đăng xuất',
				401
			);
		}

		const user = await this.broker.call('UserModel.findOne', [
			{ email: tokenPayload.email },
			{ password: 0 },
		]);

		if (!user) {
			throw new MoleculerClientError('User is not exist!', 422, '', [
				{ field: 'email', message: 'is not exist' },
			]);
		}

		return _.omit(user, ['password']);
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
