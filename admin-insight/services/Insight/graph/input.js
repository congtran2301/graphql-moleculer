const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	input TransactionStatisticInput {
		type: String
		fromDate: String!
		toDate: String!
	}
	input CustomerTransactionStatisticInput {
		accountId: String
		fromDate: String!
		toDate: String!
	}
`;
