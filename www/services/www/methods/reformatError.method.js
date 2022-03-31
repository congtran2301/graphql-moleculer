const _ = require('lodash');

module.exports = function (err) {
	return _.pick(err, ['message', 'code', 'data']);
};
