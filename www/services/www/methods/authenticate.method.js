const _ = require("lodash");
const awaitAsyncForeach = require("await-async-foreach");
const jsonWebToken = require("jsonwebtoken");
const { MoleculerError } = require("moleculer").Errors;

module.exports = async function (ctx, route, req, authHandler) {
	// console.log("file: authenticate.method.js - line 7 - req", req);
	// console.log(
	// 	"file: authenticate.method.js - line 7 - authHandler",
	// 	authHandler
	// );
	// if (req.url === '/api/list-aliases') return { credentials: null, isValid: false };
	let authConf = {
		strategies: ["Default"],
		mode: "required", // 'required', 'optional', 'try'
	};
	if (_.has(req, "$action.rest.auth")) {
		authConf = req.$action.rest.auth;
		console.log("🚀 ~ authConf", authConf);
	}
	if (_.has(route, "opts.auth")) {
		authConf = route.opts.auth;
	}
	if (authConf === false) {
		return { credentials: null, isValid: false };
	}

	if (!_.isArray(authConf.strategies)) {
		throw new MoleculerError(
			"Invalid auth strategies",
			500,
			null,
			authConf.strategies
		);
	}

	let flagStop = false;
	let decoded;
	let action;

	await awaitAsyncForeach(authConf.strategies, (strategy) => {
		if (flagStop === true) return false;
		const handler = _.get(authHandler, strategy, {});
		const { jwtKey } = handler;
		action = handler.action;

		try {
			decoded = jsonWebToken.verify(req.headers.authorization, jwtKey);
		} catch (error) {
			decoded = {};
		}
		if (!_.isEmpty(decoded)) {
			flagStop = true;
			return true;
		}
	});
	let isValid = false;
	switch (authConf.mode) {
		case "required":
			if (_.isEmpty(decoded)) {
				throw new MoleculerError(
					"Thông tin xác thực không hợp lệ",
					401,
					null,
					null
				);
			}
			isValid = true;
			break;

		case "optional":
			if (_.isEmpty(decoded) && _.has(req, "headers.authorization")) {
				throw new MoleculerError(
					"Thông tin xác thực không hợp lệ",
					401,
					null,
					null
				);
			}
			if (!_.isEmpty(decoded)) {
				isValid = true;
			}
			break;
		default:
			break;
	}
	let data;
	try {
		if (isValid === true) {
			data = await ctx.broker.call(action, decoded);
		}
	} catch (error) {
		throw new MoleculerError(error.message, 401, null, error.data);
	}
	return { credentials: decoded, isValid, data };
};
