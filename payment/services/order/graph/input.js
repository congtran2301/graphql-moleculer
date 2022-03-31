const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	input CreateOrderInput {
		amount: Int!
		description: String
		address: String
	}
	input PayInput {
		orderId: Int!
		method: PaymentMethods!
		bankId: String
	}
	input IpnInput {
		b_amount: Int!
		b_bankId: String!
		b_payDate: String!
		b_transaction: String!
		b_transactionStatus: IpnTransactionStatus!
		signature: String!
	}
`;
