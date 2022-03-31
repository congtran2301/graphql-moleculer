const _ = require('lodash');
const { sign } = require('jsonwebtoken');
module.exports = {
	name: 'AdminAuth',

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
		verifyAdmin: {
			registry: {
				auth: {
					name: 'admin',
					jwtKey: process.env.JWT_SECRET || 'secret',
				},
			},
			handler: require('./actions/verifyAdmin.action'),
		},
		login: {
			rest: {
				method: 'POST',
				fullPath: '/admin/login',
				auth: false,
			},
			params: {
				body: {
					$$type: 'object',
					email: {
						type: 'email',
						required: true,
					},
					password: {
						type: 'string',
						required: true,
					},
				},
			},
			handler: require('./actions/login.action'),
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
		generateJWT(payload) {
			return sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
		},
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
