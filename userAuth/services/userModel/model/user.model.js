const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');

const { Gender } = require('../constants/gender.constant');
const { Status } = require('../constants/accountStatus.constant');

const accountSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			default: 0,
			unique: true,
		},
		email: {
			type: String,
			require: true,
			unique: true,
		},
		password: {
			type: String,
			require: true,
		},
		fullName: {
			type: String,
			require: true,
		},
		phone: {
			type: String,
			require: true,
			unique: true,
		},
		gender: {
			type: String,
			enum: Object.values(Gender),
		},
		avatar: {
			type: String,
			default:
				'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png',
		},
		status: {
			type: String,
			enum: Object.values(Status),
			default: Status.INACTIVE,
		},
	},
	{
		timestamps: true,
	}
);

autoIncrement.initialize(mongoose.connection);
accountSchema.plugin(autoIncrement.plugin, {
	model: `User-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

accountSchema.pre('save', async function (next) {
	try {
		if (this.password && this.isModified('password')) {
			this.password = await bcrypt.hash(this.password, 10);
		}
		next();
	} catch (err) {
		next(err);
	}
});

accountSchema.pre(['findOneAndUpdate', 'updateOne'], async function (next) {
	try {
		if (this.getUpdate().password) {
			this.getUpdate().password = await bcrypt.hash(
				this.getUpdate().password,
				10
			);
		}
		if (this._update['$set'].password) {
			this._update['$set'].password = await bcrypt.hash(
				this._update['$set'].password,
				10
			);
		}
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model('User', accountSchema);
