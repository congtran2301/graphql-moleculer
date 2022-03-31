const { MoleculerClientError } = require('moleculer').Errors;
const _ = require('lodash');
const { response } = require('../../../helper/response');

module.exports = async function (ctx) {
	try {
		const orderId = ctx.params.id;
		const userId = ctx.meta.auth.data.id;

		const order = await this.broker.call('OrderModel.findOne', [
			{ id: orderId, userId },
			['-_id', '-__v', '-__v', '-updatedAt'],
		]);

		if (!order)
			throw new MoleculerClientError(
				this.i18next.t('orderNotFound'),
				404,
				'ORDER_NOT_FOUND',
				{
					orderId,
				}
			);
		return order;
	} catch (error) {
		throw new MoleculerClientError(error.message, 500, 'PAY_ERROR');
	}
};
