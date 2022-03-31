const { Status, PaymentMethods } = require('../constants/payment.constant');
const { MoleculerClientError } = require('moleculer').Errors;
const uuid = require('uuid').v4;
const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');
const { response } = require('../../../helper/response');

module.exports = async function (ctx) {
	try {
		const userId = ctx.meta.auth.data.id;
		const { orderId, method } = ctx.params.input;
		if (
			ctx.params.input.method === PaymentMethods.ATM &&
			!ctx.params.input.bankId
		) {
			throw new MoleculerClientError(
				'BankId is required',
				422,
				'BANK_ID_REQUIRED'
			);
		}

		const order = await this.broker.call('OrderModel.findOne', [
			{
				id: orderId,
				userId,
			},
		]);

		if (order.status === Status.PAID) {
			throw new MoleculerClientError(
				'Order is already paid',
				400,
				'ORDER_ALREADY_PAID'
			);
		}
		if (order.status === Status.CANCELED) {
			throw new MoleculerClientError(
				'Order is already canceled',
				400,
				'ORDER_ALREADY_CANCELED'
			);
		}

		if (order.paymentMethod) {
			throw new MoleculerClientError(
				'Order is in payment process',
				400,
				'ORDER_IS_PAID',
				{
					orderId,
				}
			);
		}

		if (method === PaymentMethods.WALLET) {
			const updatedWallet = await this.broker.call('Wallet.pay', {
				userId,
				amount: order.amount,
				transaction: order.transaction,
			});
			if (updatedWallet.id) {
				const updatedOrder = await this.broker.call(
					'OrderModel.findOneAndUpdate',
					[
						{ id: orderId },
						{
							status: Status.PAID,
							payDate: Date.now(),
							paymentMethod: PaymentMethods.WALLET,
						},
						{ new: true, select: '-_id -__v -updatedAt' },
					]
				);
				if (updatedOrder.id) {
					return { ...updatedOrder, resolveType: 'Order' };
				}
			}
		}

		if (method === PaymentMethods.ATM) {
			const { bankId } = ctx.params.input;

			const paymentURL = `https://payment.${bankId}.com/?orderId=${orderId}&amount=${order.amount}`;

			const transactionFrom3rdParty = uuid();

			const fakeDataFromPartner = {
				b_amount: order.amount,
				b_bankId: 'MB',
				b_payDate: '15/3/2022 10:33',
				b_transaction: transactionFrom3rdParty,
				b_transactionStatus: 'SUCCESS',
			};

			// Emulate partner create signature
			const privateKey = fs.readFileSync(
				'D:/Project/payment/private.pem',
				'utf-8'
			);

			const signer = crypto.createSign('RSA-SHA256');
			signer.write(JSON.stringify(fakeDataFromPartner));
			signer.end();

			const signature = signer.sign(privateKey, 'base64');
			console.log('file: pay.action.js - line 116 - signature', signature);
			// end emulate partner create signature

			await this.broker.call('OrderModel.findOneAndUpdate', [
				{ id: orderId },
				{
					partnerTransaction: transactionFrom3rdParty,
					paymentMethod: PaymentMethods.ATM,
					bankId,
				},
			]);

			return {
				paymentURL,
				resolveType: 'AtmPayResponse',
			};
		}
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'PAY_ERROR');
	}
};
