const mongoose = require('mongoose');
const { Type } = require('../constants/codeType.constant');
const autoIncrement = require('mongoose-auto-increment');

const activeCodeSchema = new mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		require: true,
	},
	userId: {
		type: Number,
		require: true,
	},
	code: {
		type: String,
		require: true,
	},
	expired: {
		type: Date,
		require: true,
	},
	type: {
		type: String,
		require: true,
		enum: Object.values(Type),
	},
});

autoIncrement.initialize(mongoose.connection);
activeCodeSchema.plugin(autoIncrement.plugin, {
	model: `activeCode-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('ActiveCode', activeCodeSchema);
