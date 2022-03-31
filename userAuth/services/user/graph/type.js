const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	type AuthQuery {
		hello: String!
	}

	type AuthMutation {
		login(input: LoginInput): LoginResponse
		register(input: RegisterInput): RegisterResponse
		forgotPassword(input: ForgotPasswordInput): ForgotPasswordResponse
		setNewPassword(input: SetNewPasswordInput): SetNewPasswordResponse
		logout: LogoutResponse
		activeAccount: ActiveAccountResponse
	}

	type LoginResponse {
		user: User!
		accessToken: String!
	}

	type ActiveAccountResponse {
		message: String!
	}

	type ForgotPasswordResponse {
		message: String!
	}

	type LogoutResponse {
		message: String!
	}

	type SetNewPasswordResponse {
		message: String!
	}

	type RegisterResponse {
		message: String!
	}

	type User {
		id: String!
		email: String!
		fullName: String!
		avatar: String!
		phone: String!
		gender: Gender!
	}
`;
