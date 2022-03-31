const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	enum PaymentMethods {
		Wallet
		Atm
	}
	enum OrderStatus {
		Pending
		Paid
		Canceled
	}
	enum IpnTransactionStatus {
		SUCCESS
		FAILED
		CANCELED
	}
`;
