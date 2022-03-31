const { State } = require('../constants/transaction.constant');

const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function ({ fromDate, toDate, type }) {
	try {
		const condition = {
			// date: {
			// 	$gte: fromDate,
			// 	$lte: toDate,
			// },
		};

		if (type) {
			condition.type = type;
		}

		const aggregateRes = await this.broker.call('TransactionModel.aggregate', [
			[
				{
					$match: condition,
				},
				{
					$group: {
						_id: {
							$dateToString: {
								format: '%Y-%m-%d',
								date: '$date',
								timezone: '+07',
							},
						},
						succeeded: {
							$sum: { $cond: [{ $eq: ['$state', State.SUCCEEDED] }, 1, 0] },
						},
						failed: {
							$sum: { $cond: [{ $eq: ['$state', State.FAILED] }, 1, 0] },
						},
						pending: {
							$sum: { $cond: [{ $eq: ['$state', State.PENDING] }, 1, 0] },
						},
						total: { $sum: 1 },
					},
				},
				{
					$sort: { _id: 1 },
				},
				{
					$project: {
						_id: 0,
						date: '$_id',
						succeeded: 1,
						failed: 1,
						pending: 1,
						total: 1,
					},
				},
			],
		]);
		if (aggregateRes.length === 0) {
			throw new MoleculerClientError('No data found', 404, '');
		}

		return aggregateRes;
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
