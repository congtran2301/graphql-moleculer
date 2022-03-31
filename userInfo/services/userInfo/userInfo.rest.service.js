const _ = require('lodash');
const MeAPI = require('../../serviceDependencies/MEAPI');
const { sign } = require('jsonwebtoken');
const { Gender } = require('./constants/gender.constant');

module.exports = {
	name: 'userInfo.rest',

	/**
	 * Settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || 'secret'
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		getUserInfo: {
			rest: {
				method: 'GET',
				fullPath: '/user/getUserInfo/',
				auth: {
					strategies: ['jwt'],
					mode: 'required'
				}
			},
			handler: require('./actions/getUserInfo.action')
		},
		updateUserInfo: {
			rest: {
				method: 'POST',
				fullPath: '/user/updateUserInfo/',
				auth: {
					strategies: ['jwt'],
					mode: 'required'
				},
				params: {
					body: {
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
					}
				}
			},
			handler: require('./actions/updateUserInfo.action')
		}
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
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		const url = process.env.FE_URL;
		const isSecurity = process.env.FE_SECURITY === 'true';
		const privateKey = process.env.FE_PRIVATEKEY;
		const publicKey = process.env.FE_PUBLICKEY;

		this.historyService = new MeAPI({
			url,
			publicKey,
			privateKey,
			isSecurity,
			'x-api-client': 'app'
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {}
};
