const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { credentials } = ctx.meta.auth;
		console.log(
			'file: logout.graph.action.js - line 6 - credentials',
			credentials
		);

		if (!credentials.userId) {
			throw new MoleculerClientError('Token is not valid!', 422, '', [
				{ field: 'token', message: 'is not valid' },
			]);
		}

		await this.broker.call('UserTokenModel.update', [
			{ id: credentials.userTokenId },
			{ logoutTime: new Date(), isDisabled: true },
		]);

		return { message: 'Logout successfully' };
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
