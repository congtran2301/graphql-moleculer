const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { State } = require('../constants/walletHistory.constant');

const walletHistorySchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	transaction: {
		type: String,
	},
	userId: {
		type: Number,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	balanceBefore: {
		type: Number,
		required: true,
	},
	balanceAfter: {
		type: Number,
		required: true,
	},
	serviceId: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	state: {
		type: String,
		enum: Object.values(State),
		default: State.PENDING,
	},
});

walletHistorySchema.plugin(autoIncrement.plugin, {
	model: 'WalletHistory-id',
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('WalletHistory', walletHistorySchema);
