const _ = require('lodash');
const { response } = require('../../../helper/response');
const {
	Type,
} = require('../../transactionModel/constants/transaction.constant');
const { MoleculerClientError } = require('moleculer').Errors;
const uuid = require('uuid').v4;

module.exports = async function (ctx) {
	try {
		const orderToCreate = ctx.params.body;
		orderToCreate.userId = ctx.meta.auth.data.id;

		const transaction = await this.broker.call('TransactionModel.create', [
			{
				amount: orderToCreate.amount,
				type: Type.ORDER,
				userId: ctx.meta.auth.data.id,
			},
		]);
		console.log(
			'file: createOrder.action.js - line 12 - transaction',
			transaction
		);

		if (!transaction.id)
			throw new MoleculerClientError(
				'Transaction not created',
				500,
				'TRANSACTION_NOT_CREATED'
			);

		orderToCreate.transaction = transaction.id;
		orderToCreate.expiredAt = Date.now() + 1000 * 60 * 60 * 2; // 2 hours

		const order = await this.broker.call('OrderModel.create', [orderToCreate]);

		if (order._id) {
			return response({
				data: _.pick(order, [
					'id',
					'description',
					'amount',
					'address',
					'userId',
					'transaction',
				]),
				code: 201,
			});
		} else {
			throw new MoleculerClientError(error.message, 500, 'CREATE_ORDER_ERROR');
		}
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'CREATE_ORDER_ERROR');
	}
};
