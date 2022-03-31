const mongoose = require('mongoose');
const {
	PaymentMethods,
	Status,
} = require('../../order/constants/payment.constant');
const autoIncrement = require('mongoose-auto-increment');
const orderSchema = new mongoose.Schema(
	{
		id: {
			type: Number,
			required: true,
			unique: true,
		},
		userId: {
			type: Number,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},
		address: {
			type: String,
		},
		paymentMethod: {
			type: String,
			enum: Object.values(PaymentMethods),
		},
		payDate: {
			type: Date,
		},
		status: {
			type: String,
			enum: Object.values(Status),
			default: Status.PENDING,
		},
		partnerTransaction: {
			type: String,
		},
		transaction: {
			type: String,
		},
		bankId: {
			type: 'String',
		},
		expiredAt: {
			type: Date,
		},
		cancellationReason: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

autoIncrement.initialize(mongoose.connection);
orderSchema.plugin(autoIncrement.plugin, {
	model: `Order-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Order', orderSchema);
