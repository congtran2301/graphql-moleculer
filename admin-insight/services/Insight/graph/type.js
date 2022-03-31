const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	type InsightQuery {
		hello: String!
	}
	type InsightMutation {
		transactionStatistic(
			input: TransactionStatisticInput!
		): TransactionStatisticResponse!

		transactionStatisticToExcel(
			input: TransactionStatisticInput!
		): TransactionStatisticToExcelResponse!

		customerTransactionStatistic(
			input: CustomerTransactionStatisticInput!
		): CustomerTransactionStatisticResponse!
	}

	type TransactionStatisticResponse {
		transactionStatisticData: [TransactionStatisticDataByDate]!
	}

	type TransactionStatisticToExcelResponse {
		filePath: String!
	}

	type CustomerTransactionStatisticResponse {
		customerTransactionStatisticData: [CustomerTransactionStatisticDataByUser]!
	}

	type TransactionStatisticDataByDate {
		date: String!
		total: Int!
		succeeded: Int!
		failed: Int!
		pending: Int!
	}

	type CustomerTransactionStatisticDataByUser {
		user: UserFromStatistic!
		total: Int!
		succeeded: Int!
		failed: Int!
		pending: Int!
	}

	type UserFromStatistic {
		id: String!
		fullName: String!
		email: String!
	}
`;
