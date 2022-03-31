const _ = require('lodash');

module.exports = {
	name: 'Auth',

	/**
	 * Settings
	 */
	settings: {},
	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		verifyUser: {
			registry: {
				auth: {
					name: 'jwt',
					jwtKey: process.env.JWT_SECRET || 'secret',
				},
			},
			handler: require('./actions/verifyUser.action'),
		},
	},
	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
