const { MoleculerClientError } = require('moleculer').Errors;
const uuid = require('uuid').v4;
const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');
const { response } = require('../../../helper/response');

module.exports = async function (ctx) {
	try {
		console.log(
			'file: getUsers.graph.action.js - line 11 - ctx.params',
			ctx.params
		);
		const { id } = ctx.params.input;
		const users = await this.broker.call('UserModel.findMany', [
			id ? { id } : {},
		]);
		console.log('file: getUsers.graph.action.js - line 11 - users', users);

		return users;
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'PAY_ERROR');
	}
};
