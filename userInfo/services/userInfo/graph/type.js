const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	type UserInfoQuery {
		getUserInfo: User
	}

	type UserInfoMutation {
		updateUserInfo(input: UpdateUserInfoInput): User
	}
`;
