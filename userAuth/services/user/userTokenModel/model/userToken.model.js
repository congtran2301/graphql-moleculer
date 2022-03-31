const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const userTokenSchema = new mongoose.Schema({
	email: {
		type: String,
		require: true,
	},
	userId: {
		type: Number,
		require: true,
	},
	id: {
		type: Number,
	},
	createdTime: {
		type: Date,
		require: true,
	},
	expiredTime: {
		type: Date,
		require: true,
	},
	logoutTime: {
		type: Date,
	},
	deviceId: {
		type: String,
		default: '',
	},
	platform: {
		type: String,
		default: '',
	},
	isDisabled: {
		type: Boolean,
		default: false,
	},
});

autoIncrement.initialize(mongoose.connection);
userTokenSchema.plugin(autoIncrement.plugin, {
	model: `Token-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('UserToken', userTokenSchema);
