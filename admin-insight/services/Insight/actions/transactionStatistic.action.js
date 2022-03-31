const { MoleculerClientError } = require('moleculer').Errors;
const { response } = require('../../../helper/response');
const moment = require('moment');
const { State } = require('../constants/transaction.constant');

module.exports = async function (ctx) {
	try {
		const { type } = ctx.params.body;
		const fromDate = moment(ctx.params.body.fromDate);
		const toDate = moment(ctx.params.body.toDate).set({
			hour: 23,
			minute: 59,
			second: 59,
		});

		if (fromDate.isAfter(toDate)) {
			throw new MoleculerClientError('fromDate must be before toDate', 422, '');
		}

		const transactionStatisticData = await this.handleTransactionStatistic({
			fromDate: fromDate.toISOString(),
			toDate: toDate.toISOString(),
			type: type,
		});

		return response({ data: transactionStatisticData, code: 200 });
	} catch (error) {
		throw new MoleculerClientError(
			error.message,
			500,
			'ERR_TRANSACTION_STATISTIC_ACTION'
		);
	}
};
