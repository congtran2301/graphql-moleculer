const { response } = require('../../../helper/response');
const { State } = require('../constants/transaction.constant');
const moment = require('moment');
// const AsyncForEach = require('await-async-foreach');

const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const startTime = new Date();
		const { accountId } = ctx.params.input;
		const fromDate = moment(ctx.params.input.fromDate);
		const toDate = moment(ctx.params.input.toDate).set({
			hour: 23,
			minute: 59,
			second: 59,
		});

		if (fromDate.isAfter(toDate)) {
			throw new MoleculerClientError('fromDate must be before toDate', 422, '');
		}

		const customerTransactionStatisticData =
			await this.handleCustomerTransactionStatistic({
				fromDate: fromDate.toISOString(),
				toDate: toDate.toISOString(),
				accountId: accountId,
			});

		const finishTime = new Date();
		const timeDiff = finishTime - startTime;
		console.log(`Transaction statistic time: ${timeDiff}`);
		return { customerTransactionStatisticData };
	} catch (error) {
		throw new MoleculerClientError(error.message, 422, '', error);
	}
};
