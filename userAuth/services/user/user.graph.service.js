const _ = require('lodash');
const { Gender } = require('../userModel/constants/gender.constant');

module.exports = {
	name: 'User.graph',

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
				AuthQuery: {
					hello: {
						action: 'User.graph.hello',
					},
				},
				AuthMutation: {
					login: {
						action: 'User.graph.login',
					},
					logout: {
						action: 'User.graph.logout',
					},
					register: {
						action: 'User.graph.register',
					},
					forgotPassword: {
						action: 'User.graph.forgotPassword',
					},
					setNewPassword: {
						action: 'User.graph.setNewPassword',
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
		GraphQl: {
			graphql: {
				query: 'AuthQuery: AuthQuery',
				mutation: 'AuthMutation: AuthMutation',
			},
			handler(ctx) {
				return true;
			},
		},
		login: {
			input: {
				$$type: 'object',
				email: 'email',
				password: 'string',
			},
			handler: require('./actions/login.graph.action'),
		},
		hello: {
			handler: async (ctx) => {
				return 'Hello world!';
			},
		},
		register: {
			input: {
				$$type: 'object',
				email: {
					type: 'string',
					required: true,
					pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				},
				phone: {
					type: 'string',
					required: true,
					pattern: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
				},
				password: 'string',
				fullName: 'string',
				gender: {
					type: 'string',
					enum: Object.values(Gender),
				},
			},
			handler: require('./actions/register.graph.action'),
		},
		forgotPassword: {
			input: {
				$$type: 'object',
				email: 'email',
			},
			handler: require('./actions/forgotPassword.graph.action'),
		},
		setNewPassword: {
			input: {
				$$type: 'object',
				email: 'email',
				password: 'string',
				code: 'string',
			},
			handler: require('./actions/setNewPassword.graph.action'),
		},
		logout: {
			handler: require('./actions/logout.graph.action'),
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
