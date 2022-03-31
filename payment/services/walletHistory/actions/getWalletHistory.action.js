const moment = require('moment');
const _ = require('lodash');
const { response } = require('../../../helper/response');
const { MoleculerError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const userId = ctx.meta.auth.data.id;
		const { fromDate, toDate } = ctx.params.params;
		const fromDateMoment = fromDate
			? moment(fromDate, 'DD-MM-YYYY')
			: moment().subtract(1, 'month');
		const toDateMoment = toDate ? moment(toDate, 'DD-MM-YYYY') : moment();

		if (fromDateMoment.isAfter(toDateMoment)) {
			throw new MoleculerError(
				'fromDate must be before toDate',
				400,
				'INVALID_DATE_RANGE'
			);
		}

		const walletHistory = await this.broker.call(
			'WalletHistoryModel.findMany',
			[
				{
					userId,
					date: {
						$gte: fromDateMoment.toDate(),
						$lte: toDateMoment.toDate(),
					},
				},
				['-_id', '-__v', '-updatedAt'],
			]
		);

		if (!walletHistory)
			throw new MoleculerError(
				'walletHistory not found',
				404,
				'WALLET_HISTORY_NOT_FOUND',
				{
					fromDate,
					toDate,
				}
			);

		return response({ code: 200, data: walletHistory });
	} catch (error) {
		throw new MoleculerError(error.message, 500, 'WALLET_HISTORY_ERROR');
	}
};
