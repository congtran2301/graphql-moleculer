const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	input UpdateUserInfoInput {
		password: String
		fullName: String
		phone: String
		gender: Gender
		avatar: String
	}
`;
