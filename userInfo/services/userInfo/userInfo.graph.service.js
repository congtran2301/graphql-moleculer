const _ = require('lodash');
const { Gender } = require('./constants/gender.constant');

module.exports = {
	name: 'UserInfo.graph',

	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: require('./graph/type'),
			input: require('./graph/input.js'),
			// enum: require('./graph/enum'),

			resolvers: {
				UserInfoQuery: {
					getUserInfo: {
						action: 'UserInfo.graph.getUserInfo'
					}
				},
				UserInfoMutation: {
					updateUserInfo: {
						action: 'UserInfo.graph.updateUserInfo'
					}
				}
			}
		}
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		GraphQlUserInfo: {
			graphql: {
				query: 'UserInfoQuery: UserInfoQuery',
				mutation: 'UserInfoMutation: UserInfoMutation'
			},
			handler(ctx) {
				return true;
			}
		},
		getUserInfo: {
			handler: require('./actions/getUserInfo.graph.action')
		},
		updateUserInfo: {
			input: {
				$$type: 'object',
				password: 'string|optional|min:6',
				fullName: 'string|optional',
				phone: {
					type: 'string',
					pattern: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
					optional: true
				},
				gender: {
					type: 'string',
					enum: Object.values(Gender),
					optional: true
				},
				avatar: 'string|optional'
			},
			handler: require('./actions/updateUserInfo.graph.action')
		}
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
	async stopped() {}
};
