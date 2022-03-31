const { State } = require('../constants/transaction.constant');

module.exports = async function ({ fromDate, toDate, accountId }) {
	const condition = {
		// date: {
		// 	// $gte: fromDate,
		// 	// $lte: toDate,
		// },
	};

	if (accountId) {
		condition.userId = accountId;
	}

	console.log(condition);
	const transactionStatisticData = await this.broker.call(
		'TransactionModel.aggregate',
		[
			[
				{
					$match: condition,
				},
				{
					$group: {
						_id: {
							// date: {
							// 	$dateToString: {
							// 		format: '%Y-%m-%d',
							// 		date: '$date',
							// 	},
							// },
							userId: '$userId',
						},
						// user: { $first: { $first: '$user' } },
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
						_id: 1,
						succeeded: 1,
						failed: 1,
						pending: 1,
						total: 1,
						// user: {
						// 	id: '$user.id',
						// 	name: '$user.fullName',
						// 	email: '$user.email',
						// },
						date: '$_id.date',
					},
				},
			],
		],
		{ timeout: 90000 }
	);
	const mappedData = await Promise.all(
		transactionStatisticData.map(async (item) => {
			const { _id } = item;

			const user = await this.broker.call('UserModel.findOne', [
				{ id: _id.userId },
				{ fullName: 1, email: 1, id: 1, _id: 0 },
			]);

			item.user = user;
			delete item._id;
			return item;
		})
	);
	return mappedData;
};
