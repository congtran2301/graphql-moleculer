const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const adminTokenSchema = new mongoose.Schema({
	email: {
		type: String,
		require: true,
	},
	adminId: {
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
adminTokenSchema.plugin(autoIncrement.plugin, {
	model: `AdminToken-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('AdminToken', adminTokenSchema);
