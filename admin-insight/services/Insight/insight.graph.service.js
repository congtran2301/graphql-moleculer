const _ = require('lodash');

module.exports = {
	name: 'Insight.graph',

	mixins: [],
	hooks: {
		before: {
			'*': 'requireAdmin',
		},
	},
	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: require('./graph/type'),
			input: require('./graph/input.js'),
			enum: require('./graph/enum'),

			resolvers: {
				InsightQuery: {
					hello: () => 'Hello World!',
				},
				InsightMutation: {
					transactionStatistic: {
						action: 'Insight.graph.transactionStatistic',
					},
					customerTransactionStatistic: {
						action: 'Insight.graph.customerTransactionStatistic',
					},
					transactionStatisticToExcel: {
						action: 'Insight.graph.transactionStatisticToExcel',
					},
				},
			},
		},
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		GraphQlInsight: {
			graphql: {
				query: 'InsightQuery: InsightQuery',
				mutation: 'InsightMutation: InsightMutation',
			},
			handler(ctx) {
				return true;
			},
		},
		transactionStatistic: {
			input: {
				$$type: 'object',
				type: 'string|optional',
				fromDate: 'string',
				toDate: 'string',
			},
			handler: require('./actions/transactionStatistic.graph.action'),
		},
		customerTransactionStatistic: {
			input: {
				$$type: 'object',
				accountId: 'string',
				fromDate: 'string',
				toDate: 'string',
			},
			handler: require('./actions/customerTransactionStatistic.graph.action'),
		},
		transactionStatisticToExcel: {
			input: {
				$$type: 'object',
				type: 'string|optional',
				fromDate: 'string',
				toDate: 'string',
			},
			handler: require('./actions/transactionStatisticToExcel.graph.action'),
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
		requireAdmin: require('./methods/requireAdmin.method'),
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
