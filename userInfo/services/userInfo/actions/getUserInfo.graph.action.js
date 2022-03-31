const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	const { email, userId } = ctx.meta.auth.credentials;

	if (!email || !userId) throw new MoleculerClientError('Not authorized', 401);

	const user = await ctx.call('UserModel.findOne', [
		{ id: userId },
		'-password -createdAt -updatedAt'
	]);

	if (!user) {
		throw new MoleculerClientError('User not found', 400);
	}

	return user;
};
