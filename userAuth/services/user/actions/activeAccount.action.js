const { Type } = require('../../activeCodeModel/constants/codeType.constant');
const { Status } = require('../../userModel/constants/accountStatus.constant');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { userId, code } = ctx.params.query;

		const activeCode = await this.broker.call('ActiveCodeModel.findOne', [
			{ userId, code, type: Type.ACTIVE_ACCOUNT },
		]);

		if (!activeCode) {
			throw new MoleculerClientError('Invalid code!', 422, '', [
				{ field: 'code', message: 'is invalid' },
			]);
		}

		if (activeCode.expired < Date.now()) {
			throw new MoleculerClientError('Code is expired!', 422, '', [
				{ field: 'code', message: 'is expired' },
			]);
		}

		await this.broker.call('UserModel.updateOne', [
			{ id: userId },
			{ status: Status.ACTIVE },
		]);

		await this.broker.call('ActiveCodeModel.delete', [
			{ userId, code, type: Type.ACTIVE_ACCOUNT },
		]);

		return {
			message: 'Active account success!',
		};
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
