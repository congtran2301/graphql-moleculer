const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	const infoToUpdate = ctx.params.input;
	const { credentials } = ctx.meta.auth;

	const user = await ctx.call('UserModel.findOne', [
		{ email: credentials.email }
	]);

	if (!user) {
		throw new MoleculerClientError('User not found', 400);
	}
	const updatedUser = await ctx.call('UserModel.findOneAndUpdate', [
		{ email: credentials.email },
		{ $set: infoToUpdate },
		{ new: true }
	]);

	return _.pick(updatedUser, ['id', 'email', 'fullName', 'phone', 'avatar']);
};
