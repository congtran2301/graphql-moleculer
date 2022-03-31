const Cron = require('moleculer-cron');

const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
	name: 'OrderCancellation',

	/**
	 * Settings
	 */
	mixins: [Cron],
	crons: [
		{
			name: 'autoCancelOrder',
			cronTime: '*/59 * * * * *',
			onTick: async function () {
				await this.getLocalService('OrderCancellation').actions.cancelOrders();
			},
			timeZone: 'Asia/Ho_Chi_Minh',
		},
	],
	settings: {
		TIME_TO_CANCEL_ORDER_IN_MINUTES: 60 * 2,
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		cancelOrders: {
			handler: require('./actions/cancelOrders.action'),
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
