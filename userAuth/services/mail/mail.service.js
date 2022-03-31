const Mail = require('moleculer-mail');

module.exports = {
	name: 'Mail',
	/**
	 * Settings
	 */
	mixins: [Mail],
	settings: {
		from: process.env.GMAIL_USER,
		transport: {
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		},
	},

	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */

	// async stopped() {},

	async afterConnected() {
		this.logger.info('Connected successfully...');
	},
};
