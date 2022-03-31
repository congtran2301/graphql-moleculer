const { MoleculerClientError } = require('moleculer').Errors;
const moment = require('moment');
const { State } = require('../constants/transaction.constant');

module.exports = async function (ctx) {
	try {
		const { type } = ctx.params.input;
		const fromDate = moment(ctx.params.input.fromDate);
		const toDate = moment(ctx.params.input.toDate).set({
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

		return { transactionStatisticData };
	} catch (error) {
		throw new MoleculerClientError(
			error.message,
			500,
			'ERR_TRANSACTION_STATISTIC_ACTION'
		);
	}
};
