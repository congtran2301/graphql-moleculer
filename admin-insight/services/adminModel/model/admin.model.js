const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const autoIncrement = require("mongoose-auto-increment");

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
	},
	{
		timestamps: true,
	}
);

autoIncrement.initialize(mongoose.connection);
accountSchema.plugin(autoIncrement.plugin, {
	model: `Admin-id`,
	field: "id",
	startAt: 1,
	incrementBy: 1,
});

accountSchema.pre("save", async function (next) {
	try {
		if (this.password && this.isModified("password")) {
			this.password = await bcrypt.hash(this.password, 10);
		}
		next();
	} catch (err) {
		next(err);
	}
});

accountSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
	try {
		if (this.getUpdate().password) {
			this.getUpdate().password = await bcrypt.hash(
				this.getUpdate().password,
				10
			);
		}
		if (this._update["$set"].password) {
			this._update["$set"].password = await bcrypt.hash(
				this._update["$set"].password,
				10
			);
		}
		next();
	} catch (err) {
		next(err);
	}
});

module.exports = mongoose.model("Admin", accountSchema);
