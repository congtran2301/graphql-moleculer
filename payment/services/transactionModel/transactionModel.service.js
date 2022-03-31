const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const MongooseAction = require('moleculer-db-adapter-mongoose-action');
const Transaction = require('./model/transaction.model');

module.exports = {
	name: 'TransactionModel',

	mixins: [DbService],

	adapter: new MongooseAdapter(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	}),
	model: Transaction,
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
	actions: MongooseAction(),

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
	started() {},

	/**
	 * Service stopped lifecycle event handler
	 */

	// async stopped() {},

	async afterConnected() {
		this.logger.info('Connected successfully...');
	},
};
