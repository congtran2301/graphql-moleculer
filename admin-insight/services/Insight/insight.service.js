const _ = require('lodash');
const { sign } = require('jsonwebtoken');

module.exports = {
	name: 'Insight',

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
		transactionStatistic: {
			rest: {
				method: 'POST',
				fullPath: '/insight/transaction-statistic',
				auth: {
					strategies: ['admin'],
					mode: 'required',
				},
				timeout: 3000,
			},
			params: {
				body: {
					$$type: 'object',
					fromDate: 'string',
					toDate: 'string',
					type: 'string|optional',
				},
			},
			timeout: 3000,
			handler: require('./actions/transactionStatistic.action'),
		},
		transactionStatisticToExcel: {
			rest: {
				method: 'POST',
				fullPath: '/insight/transaction-statistic-to-excel',
				auth: {
					strategies: ['admin'],
					mode: 'required',
				},
			},
			params: {
				body: {
					$$type: 'object',
					fromDate: 'string',
					toDate: 'string',
					type: 'string|optional',
				},
			},
			handler: require('./actions/transactionStatisticToExcel.action'),
		},
		customerTransactionStatistic: {
			rest: {
				method: 'POST',
				fullPath: '/insight/customer-transaction-statistic',
				auth: {
					strategies: ['admin'],
					mode: 'required',
				},
			},
			params: {
				body: {
					$$type: 'object',
					fromDate: 'string',
					toDate: 'string',
					accountId: 'number|optional',
				},
			},
			timeout: 90000,
			handler: require('./actions/customerTransactionStatistic.action'),
		},
		customerTransactionStatisticToExcel: {
			rest: {
				method: 'POST',
				fullPath: '/insight/customer-transaction-to-excel',
				auth: {
					strategies: ['admin'],
					mode: 'required',
				},
			},
			params: {
				body: {
					$$type: 'object',
					fromDate: 'string',
					toDate: 'string',
					accountId: 'number|optional',
				},
			},
			handler: require('./actions/customerTransactionStatisticToExcel.action'),
		},
	},
	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		handleTransactionStatistic: require('./methods/handleTransactionStatistic.method'),
		handleCustomerTransactionStatistic: require('./methods/handleCustomerTransactionStats.method'),
	},

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
