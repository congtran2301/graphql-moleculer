const { MoleculerClientError } = require('moleculer').Errors;
const AsyncLock = require('async-lock');
const {
	Status,
	PaymentMethods,
} = require('../../order/constants/payment.constant');
const {
	State,
} = require('../../walletHistoryModel/constants/walletHistory.constant');

const lock = new AsyncLock();

module.exports = async function (ctx) {
	return new this.Promise((resolve, reject) => {
		try {
			const { userId, amount, transaction } = ctx.params;
			console.log(
				'file: pay.action.js - line 17 - returnnewthis.Promise - transaction',
				transaction
			);
			lock.acquire(userId, async (done) => {
				// setTimeout(async () => {
				const wallet = await this.broker.call('WalletModel.findOne', [
					{ userId },
				]);

				if (wallet.balance < amount)
					throw new MoleculerClientError(
						'Insufficient balance',
						400,
						'INSUFFICIENT_BALANCE',
						{ balance: wallet.balance }
					);

				const existWalletHistory = await this.broker.call(
					'WalletHistoryModel.findOne',
					[
						{
							transaction,
						},
					]
				);
				console.log(
					'file: pay.action.js - line 43 - //setTimeout - existWalletHistory',
					existWalletHistory
				);

				if (existWalletHistory) {
					reject(
						new MoleculerClientError(
							'Transaction already exist',
							400,
							'TRANSACTION_ALREADY_EXIST',
							{ transaction }
						)
					);
				}

				const walletHistory = await this.broker.call(
					'WalletHistoryModel.create',
					[
						{
							userId,
							amount,
							transaction,
							balanceBefore: wallet.balance,
							balanceAfter: wallet.balance - amount,
							serviceId: 1, // common payment
							date: Date.now(),
						},
					]
				);
				if (walletHistory.id) {
					const updatedWallet = await this.broker.call(
						'WalletModel.findOneAndUpdate',
						[{ userId }, { $inc: { balance: -amount } }, { new: true }]
					);
					if (updatedWallet.id) {
						const updatedWalletHistory = await this.broker.call(
							'WalletHistoryModel.findOneAndUpdate',
							[
								{
									transaction,
								},
								{
									$set: {
										state: State.SUCCEEDED,
									},
								},
								{ new: true },
							]
						);
						const updatedTransaction = await this.broker.call(
							'TransactionModel.findOneAndUpdate',
							[
								{
									id: transaction,
								},
								{
									$set: {
										state: State.SUCCEEDED,
									},
								},
								{ new: true },
							]
						);

						resolve(updatedWallet);
						done();
					}
				}
				// }, 2000);
			});
		} catch (error) {
			reject(new MoleculerClientError(error.message, 500, 'PAY_ERROR'));
		}
	});
};
