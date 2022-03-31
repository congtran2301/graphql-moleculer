const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const MongooseAction = require('moleculer-db-adapter-mongoose-action');
const Admin = require('./model/admin.model');

module.exports = {
	name: 'AdminModel',

	mixins: [DbService],

	adapter: new MongooseAdapter('mongodb://localhost:27017/userInfomationApp', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	}),
	model: Admin,
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
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */

	// async stopped() {},

	async afterConnected() {
		this.logger.info('Connected successfully...');
	},
};
