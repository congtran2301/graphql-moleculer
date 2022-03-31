const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
	name: 'Wallet',

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
		pay: {
			params: {
				userId: 'number',
				amount: 'number',
				transaction: 'string',
			},
			handler: require('./actions/pay.action'),
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
