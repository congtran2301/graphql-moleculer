const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const walletSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	userId: {
		type: Number,
		required: true,
	},
	balance: {
		type: Number,
		default: 100000000,
		min: 0,
	},
});

autoIncrement.initialize(mongoose.connection);
walletSchema.plugin(autoIncrement.plugin, {
	model: `Wallet-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Wallet', walletSchema);
