const _ = require("lodash");
const Moment = require("moment");

const { GraphQLScalarType, Kind } = require("graphql");
const BigInt = require("apollo-type-bigint").default;

module.exports = {
	DateTime: new GraphQLScalarType({
		name: "DateTime",
		description: "DateTime",
		serialize(value) {
			const datetime = new Moment(value, true);
			if (datetime.isValid() === true) {
				return datetime.toISOString();
			}
			throw new TypeError(
				`DateTime cannot represent non-datetime value: ${value}`
			);
		},
		parseValue(value) {
			const datetime = new Moment(value, true);
			if (datetime.isValid() === true) {
				return datetime;
			}
			throw new TypeError(
				`DateTime cannot represent non-datetime value: ${value}`
			);
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.STRING) {
				const datetime = new Moment(ast.value, true);

				if (datetime.isValid() === true) {
					return datetime;
				}
				throw new TypeError(
					`DateTime cannot represent non-datetime value: ${ast.value}`
				);
			}
		},
	}),
	BigInt: new BigInt("safe"),
	PayResponse: {
		__resolveType: (obj) => {
			// console.log("file: resolvers.js - line 45 - ctx", obj);
			return obj.resolveType;
		},
	},
};
