const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');

module.exports = function (ctx) {
	const actionList = ctx.broker.registry.getActionList({ withActions: true, grouping: true });

	const rest = _.filter(actionList, (data) => _.has(data, 'action.rest.fullPath') && _.has(data, 'action.rest.security'));
	const securityURI = {};
	_.forEach(rest, (data) => {
		if (_.has(data, 'action.rest.security')) {
			if (data.action.rest.security === false && !securityURI[data.action.rest.fullPath]) {
				securityURI[data.action.rest.fullPath] = pathToRegexp(data.action.rest.fullPath);
			}
		}
	});

	const registryAuth = _.filter(actionList, (data) => _.has(data, 'action.registry.auth'));
	const auth = {};
	_.forEach(registryAuth, (data) => {
		if (_.has(data, 'action.registry.auth.name') && _.has(data, 'action.registry.auth.jwtKey')) {
			auth[data.action.registry.auth.name] = {
				jwtKey: data.action.registry.auth.jwtKey,
				action: data.name
			};
		}
	});

	return {
		securityURI,
		auth
	};
};
