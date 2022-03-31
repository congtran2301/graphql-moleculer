const mongoose = require('mongoose');
const { State, Type } = require('../constants/transaction.constant');
const uuid = require('uuid').v4;

const transactionSchema = new mongoose.Schema(
	{
		id: {
			type: String,
		},
		userId: {
			type: Number,
			required: true,
		},
		date: {
			type: Date,
		},
		state: {
			type: String,
			enum: Object.values(State),
			default: State.PENDING,
		},
		amount: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: Object.values(Type),
		},
	},
	{
		timestamps: true,
	}
);

transactionSchema.pre('save', function (next) {
	if (this.isNew) {
		this.id = uuid();
		this.date = new Date();
	}
	next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
