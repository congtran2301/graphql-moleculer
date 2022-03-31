const _ = require('lodash');
const { response } = require('../../../helper/response');
const {
	Type,
} = require('../../transactionModel/constants/transaction.constant');
const { MoleculerClientError } = require('moleculer').Errors;
const uuid = require('uuid').v4;

module.exports = async function (ctx) {
	try {
		const orderToCreate = ctx.params.input;
		orderToCreate.userId = ctx.meta.auth.data.id;

		const transaction = await this.broker.call('TransactionModel.create', [
			{
				amount: orderToCreate.amount,
				type: Type.ORDER,
				userId: ctx.meta.auth.data.id,
			},
		]);

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
			return _.pick(order, [
				'id',
				'description',
				'amount',
				'address',
				'userId',
				'transaction',
				'status',
			]);
		} else {
			throw new MoleculerClientError(error.message, 500, 'CREATE_ORDER_ERROR');
		}
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'CREATE_ORDER_ERROR');
	}
};
