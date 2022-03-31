const _ = require('lodash');
const {
	PaymentMethods,
	TransactionStatus,
} = require('./constants/payment.constant');
const { MoleculerClientError } = require('moleculer').Errors;
const i18next = require('i18next');

module.exports = {
	name: 'Order',

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
		create: {
			rest: {
				method: 'POST',
				fullPath: '/order',
				auth: {
					strategies: ['jwt'],
					mode: 'required',
				},
			},
			params: {
				body: {
					$$type: 'object',
					amount: 'number',
					description: 'string|optional',
					address: 'string|optional',
				},
			},
			handler: require('./actions/createOrder.action'),
		},
		pay: {
			rest: {
				method: 'POST',
				fullPath: '/order/pay',
				auth: {
					strategies: ['jwt'],
					mode: 'required',
				},
			},
			params: {
				body: {
					$$type: 'object',
					orderId: 'number',
					method: {
						type: 'string',
						enum: Object.values(PaymentMethods),
					},
					bankId: 'string|optional',
				},
			},
			handler: require('./actions/pay.action'),
		},
		ipnReturn: {
			rest: {
				method: 'POST',
				fullPath: '/order/ipn-return',
				auth: false,
			},
			params: {
				body: {
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
			},
			handler: require('./actions/ipn.action'),
		},
		getOrder: {
			rest: {
				method: 'GET',
				fullPath: '/order/:id',
				auth: {
					strategies: ['jwt'],
					mode: 'required',
				},
			},
			handler: require('./actions/getOrder.action'),
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
	async started() {
		this.i18next = require('i18next');
		await this.i18next.init({
			lng: 'en',
			debug: true,
			resources: {
				vi: {
					translation: require('../../locales/vi.json'),
				},
				en: {
					translation: require('../../locales/en.json'),
				},
			},
		});
		await this.i18next.changeLanguage('vi');
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
