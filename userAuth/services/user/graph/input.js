const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	input LoginInput {
		email: String!
		password: String!
	}

	input RegisterInput {
		email: String!
		password: String!
		fullName: String!
		phone: String!
		gender: Gender
	}

	input ForgotPasswordInput {
		email: String!
	}

	input SetNewPasswordInput {
		email: String!
		password: String!
		code: String!
	}
`;
