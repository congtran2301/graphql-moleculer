const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { credentials } = ctx.meta.auth;
		if (!credentials.adminId) throw new Error('You are not admin');
	} catch (error) {
		throw new MoleculerClientError('Admin required', 422, 'ERR_ADMIN_REQUIRED');
	}
};
