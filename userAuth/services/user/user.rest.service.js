const _ = require('lodash');
const { sign } = require('jsonwebtoken');

module.exports = {
	name: 'user.rest',

	/**
	 * Settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || 'secret',
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		login: {
			rest: {
				method: 'POST',
				fullPath: '/user/login',
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
			hooks: {
				before(ctx) {
					if (ctx.params.body.email)
						ctx.params.body.email = ctx.params.body.email.toLowerCase();
				},
			},
			handler: require('./actions/login.action'),
		},
		register: {
			rest: {
				method: 'POST',
				fullPath: '/user/register',
				auth: false,
			},
			params: {
				body: {
					$$type: 'object',
					email: {
						type: 'string',
						required: true,
						pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
					},
					password: 'string|min:6',
					fullName: 'string|required',
					phone: {
						type: 'string',
						required: true,
						pattern: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
					},
					gender: {
						type: 'string',
						enum: ['male', 'female'],
						required: true,
					},
					avatar: 'string|optional',
				},
			},
			hooks: {
				before(ctx) {
					if (ctx.params.body.email)
						ctx.params.body.email = ctx.params.body.email.toLowerCase();
				},
			},
			handler: require('./actions/register.action'),
		},
		forgotPassword: {
			rest: {
				method: 'POST',
				fullPath: '/user/forgot-password',
				auth: false,
			},
			params: {
				body: {
					$$type: 'object',
					email: {
						type: 'email',
						required: true,
					},
				},
			},
			handler: require('./actions/forgotPassword.action'),
		},
		setNewPassword: {
			rest: {
				method: 'POST',
				fullPath: '/user/reset-password/',
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
					code: {
						type: 'string',
						required: true,
					},
				},
			},
			handler: require('./actions/setNewPassword.action'),
		},
		lougout: {
			rest: {
				method: 'GET',
				fullPath: '/user/logout',
				auth: {
					strategies: ['jwt'],
					mode: 'required',
				},
			},
			handler: require('./actions/logout.action'),
		},
		activeAccount: {
			rest: {
				method: 'GET',
				fullPath: '/user/active-account/',
				auth: false,
			},
			handler: require('./actions/activeAccount.action'),
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
