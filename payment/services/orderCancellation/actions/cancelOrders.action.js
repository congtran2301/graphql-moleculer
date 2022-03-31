const { Status } = require('../../order/constants/payment.constant');
const moment = require('moment');
const AsyncForEach = require('await-async-foreach');
const { flow } = require('lodash');
const {
	Type,
	State,
} = require('../../transactionModel/constants/transaction.constant');
module.exports = async function (ctx) {
	try {
		const orders = await this.broker.call('OrderModel.findMany', [
			{
				status: Status.PENDING,
				expiredAt: {
					$lte: Date.now(),
				},
			},
		]);

		let canceledOrders = 0;
		await AsyncForEach(
			orders,
			async (order) => {
				await this.broker.call('OrderModel.updateOne', [
					{
						id: order.id,
					},
					{
						status: Status.CANCELED,
						cancellationReason:
							'Payment time expired. Order must be paid within 2 hours',
					},
				]);
				await this.broker.call('TransactionModel.findOneAndUpdate', [
					{
						id: order.transaction,
					},
					{
						$set: {
							state: State.FAILED,
						},
					},
				]);

				canceledOrders++;
			},
			'parallel'
		);
		console.log('[cronJob] - canceledOrders: ', canceledOrders);
	} catch (error) {
		console.log(error.message);
	}
};
