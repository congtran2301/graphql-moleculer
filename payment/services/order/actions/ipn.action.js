const { MoleculerClientError } = require('moleculer').Errors;
const moment = require('moment');
const { Status, TransactionStatus } = require('../constants/payment.constant');
const _ = require('lodash');
const crypto = require('crypto');
const fs = require('fs');
const { response } = require('../../../helper/response');
const {
	State,
} = require('../../transactionModel/constants/transaction.constant');

module.exports = async function (ctx) {
	try {
		const ipnPayload = _.omit(ctx.params.body, ['signature']);
		const signature = ctx.params.body.signature;

		const publicKey = fs.readFileSync('D:/Project/payment/public.pem', 'utf-8');

		const verifier = crypto.createVerify('RSA-SHA256');
		verifier.write(JSON.stringify(ipnPayload));
		verifier.end();

		const isVerified = verifier.verify(publicKey, signature, 'base64');

		if (!isVerified) {
			throw new MoleculerClientError(
				this.i18next.t('invalidSignature'),
				400,
				'ERR_INVALID_SIGNATURE'
			);
		}

		const order = await this.broker.call('OrderModel.findOne', [
			{
				partnerTransaction: ipnPayload.b_transaction,
				status: Status.PENDING,
			},
		]);

		if (!order)
			throw new MoleculerClientError(
				this.i18next.t('orderNotFound'),
				404,
				'ORDER_NOT_FOUND'
			);
		if (ipnPayload.b_transactionStatus === TransactionStatus.SUCCESS) {
			const updatedOrder = await this.broker.call(
				'OrderModel.findOneAndUpdate',
				[
					{ _id: order._id },
					{
						status: Status.PAID,
						payDate: moment(ipnPayload.b_payDate, 'DD-MM-YYYY')
							.utcOffset(7)
							.toDate(),
					},
					{ new: true, select: '-_id -__v -updatedAt' },
				]
			);
			const updatedTransaction = await this.broker.call(
				'TransactionModel.findOneAndUpdate',
				[
					{
						id: order.transaction,
					},
					{
						status: State.FAILED,
					},
					{ new: true, select: '-_id -__v -updatedAt' },
				]
			);
			return updatedOrder;
		}
		if (ipnPayload.b_transactionStatus === TransactionStatus.CANCELED) {
			const updatedOrder = await this.broker.call(
				'OrderModel.findOneAndUpdate',
				[
					{ _id: order._id },
					{
						status: Status.CANCELED,
						cancellationReason:
							ipnPayload.b_cancellationReason ||
							'Transaction canceled by partner',
					},
					{ new: true, select: '-_id -__v -updatedAt' },
				]
			);
			const updatedTransaction = await this.broker.call(
				'TransactionModel.findOneAndUpdate',
				[
					{
						id: order.transaction,
					},
					{
						status: State.FAILED,
					},
					{ new: true, select: '-_id -__v -updatedAt' },
				]
			);
			return updatedOrder;
		}
		if (ipnPayload.b_transactionStatus === TransactionStatus.FAILED) {
		}

		return response({ code: 200, message: this.i18next.t('paymentFail') });
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'PAY_ERROR');
	}
};
