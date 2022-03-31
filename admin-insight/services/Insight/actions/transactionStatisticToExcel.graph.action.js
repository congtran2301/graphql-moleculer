const xl = require('excel4node');
const fs = require('fs');
const { MoleculerClientError } = require('moleculer').Errors;
const moment = require('moment');

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

		const data = await this.handleTransactionStatistic({
			fromDate: fromDate.toISOString(),
			toDate: toDate.toISOString(),
			type: type,
		});

		const wb = new xl.Workbook();
		const ws = wb.addWorksheet('Transaction Statistic');
		ws.cell(1, 1).string('Date');
		ws.cell(1, 2).string('Succeeded');
		ws.cell(1, 3).string('Failed');
		ws.cell(1, 4).string('Pending');
		ws.cell(1, 5).string('Total');

		let row = 2;
		for (const item of data) {
			ws.cell(row, 1).string(item.date);
			ws.cell(row, 2).number(item.succeeded);
			ws.cell(row, 3).number(item.failed);
			ws.cell(row, 4).number(item.pending);
			ws.cell(row, 5).number(item.total);
			row++;
		}

		const fileName = `TransactionStatistic_${moment().format(
			'YYYYMMDDHHmmss'
		)}.xlsx`;
		const filePath = `${process.env.UPLOAD_PATH}/${fileName}`;
		await wb.write(filePath);

		return {
			filePath,
		};
	} catch (error) {
		throw new MoleculerClientError(error.message, 404, '');
	}
};
