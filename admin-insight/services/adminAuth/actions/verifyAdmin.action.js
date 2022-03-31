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

		const adminToken = await this.broker.call('AdminTokenModel.findOne', [
			{
				id: tokenPayload.adminTokenId,
				isDisabled: { $ne: true },
			},
		]);

		if (
			!adminToken ||
			adminToken.expiredTime < new Date() ||
			adminToken.logoutTime
		) {
			throw new MoleculerClientError(
				'Thông tin xác thực không hợp lệ hoặc đã đăng xuất',
				401
			);
		}

		const adminUser = await this.broker.call('AdminModel.findOne', [
			{ email: tokenPayload.email },
			{ password: 0 },
		]);

		if (!adminUser) {
			throw new MoleculerClientError('User is not exist!', 422, '', [
				{ field: 'email', message: 'is not exist' },
			]);
		}

		return _.omit(adminUser, ['password']);
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
