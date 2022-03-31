const _ = require('lodash');

module.exports = async function (ctx, route, req) {
	ctx.meta.clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	ctx.meta.auth = ctx.meta.user;
	delete ctx.meta.user;
};
