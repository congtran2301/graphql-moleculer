const xl = require('excel4node');
const fs = require('fs');
const { MoleculerClientError } = require('moleculer').Errors;
const moment = require('moment');

module.exports = async function (ctx) {
	try {
		const startTime = new Date();
		const { accountId } = ctx.params.body;
		const fromDate = moment(ctx.params.body.fromDate);
		const toDate = moment(ctx.params.body.toDate).set({
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

		const wb = new xl.Workbook();
		const ws = wb.addWorksheet('Transaction Statistic');
		ws.cell(1, 1).string('customer');
		ws.cell(1, 2).string('userId');
		ws.cell(1, 3).string('email');
		ws.cell(1, 4).string('total');
		ws.cell(1, 5).string('succeeded');
		// ws.cell(1, 6).string('date');

		let row = 2;
		for (const item of customerTransactionStatisticData) {
			ws.cell(row, 1).string(item.user.fullName);
			ws.cell(row, 2).number(item.user.id);
			ws.cell(row, 3).string(item.user.email);
			ws.cell(row, 4).number(item.total);
			ws.cell(row, 5).number(item.succeeded);
			// ws.cell(row, 6).string(moment(item.date).format('DD/MM/YYYY'));
			row++;
		}

		const fileName = `CustomerTransactionStatistic_${moment().format(
			'YYYYMMDDHHmmss'
		)}.xlsx`;
		const filePath = `${process.env.UPLOAD_PATH}/${fileName}`;
		await wb.write(filePath);

		return fs.createReadStream(filePath);
	} catch (error) {
		throw new MoleculerClientError(error.message, 404, '');
	}
};
