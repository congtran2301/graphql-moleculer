const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	type PaymentQuery {
		getOrder(id: Int!): Order!
	}

	union PayResponse = Order | AtmPayResponse

	type PaymentMutation {
		createOrder(input: CreateOrderInput): Order
		ipn(input: IpnInput): Order
		pay(input: PayInput): PayResponse
	}

	type AtmPayResponse {
		paymentURL: String!
	}

	type Order {
		id: Int!
		amount: Int!
		description: String
		address: String
		userId: String!
		transaction: String
		status: OrderStatus!
	}
`;
