const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { Status } = require('../../userModel/constants/accountStatus.constant');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const { email, password } = ctx.params.body;

		const user = await this.broker.call('UserModel.findOne', [
			{ email, status: { $ne: Status.DELETED } },
		]);

		if (user.status === Status.INACTIVE) {
			throw new MoleculerClientError('Your account is inactive!', 422);
		}

		if (!user)
			throw new MoleculerClientError('Email or password is invalid!', 422, '', [
				{ field: 'email', message: 'is invalid' },
				{ field: 'password', message: 'is invalid' },
			]);

		const res = await bcrypt.compare(password, user.password);
		if (!res)
			throw new MoleculerClientError('Wrong password!', 422, '', [
				{ field: 'password', message: 'wrong password' },
			]);

		const now = Date.now();

		const userToken = await this.broker.call('UserTokenModel.create', [
			{
				email,
				userId: user.id,
				expiredTime: now + 1000 * 60 * 60 * 24 * 7,
				createdTime: now,
			},
		]); // 1 week

		const accessToken = this.generateJWT({
			userId: user.id,
			email: user.email,
			userTokenId: userToken.id,
		});

		return {
			user: _.pick(user, ['email', 'fullName', 'phone', 'gender', 'avatar']),
			accessToken,
		};
	} catch (error) {
		throw new MoleculerClientError(error.message);
	}
};
