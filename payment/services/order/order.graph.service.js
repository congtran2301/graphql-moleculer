const _ = require('lodash');
const {
	PaymentMethods,
	TransactionStatus,
} = require('./constants/payment.constant');

module.exports = {
	name: 'Order.graph',

	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: require('./graph/type'),
			input: require('./graph/input.js'),
			enum: require('./graph/enum'),

			resolvers: {
				PaymentQuery: {
					getOrder: {
						action: 'Order.graph.getOrder',
					},
				},
				PaymentMutation: {
					createOrder: {
						action: 'Order.graph.create',
					},
					pay: {
						action: 'Order.graph.pay',
					},
					ipn: {
						action: 'Order.graph.ipn',
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
		GraphQlPayment: {
			graphql: {
				query: 'PaymentQuery: PaymentQuery',
				mutation: 'PaymentMutation: PaymentMutation',
			},
			handler(ctx) {
				return true;
			},
		},
		create: {
			input: {
				$$type: 'object',
				amount: 'number',
				description: 'string|optional',
				address: 'string|optional',
			},
			handler: require('./actions/createOrder.graph.action'),
		},
		getOrder: {
			handler: require('./actions/getOrder.graph.action'),
		},
		pay: {
			input: {
				$$type: 'object',
				orderId: 'number',
				method: {
					type: 'string',
					enum: Object.values(PaymentMethods),
				},
				bankId: 'string|optional',
			},
			handler: require('./actions/pay.graph.action'),
		},
		ipn: {
			input: {
				$$type: 'object',
				b_amount: 'number',
				b_bankId: 'string',
				b_payDate: 'string',
				b_transaction: 'string',
				b_transactionStatus: {
					type: 'string',
					enum: Object.values(TransactionStatus),
				},
			},
			handler: require('./actions/ipn.graph.action'),
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
