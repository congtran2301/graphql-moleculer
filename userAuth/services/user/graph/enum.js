const gql = require('moleculer-apollo-server').moleculerGql;

module.exports = gql`
	enum Gender {
		MALE
		FEMALE
	}
`;
