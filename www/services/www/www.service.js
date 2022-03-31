const _ = require("lodash");
const ApiGateway = require("moleculer-web-extends");
const { ApolloService } = require("moleculer-apollo-server");
const { MoleculerError } = require("moleculer").Errors;

const instance = {
	securityURI: {},
	auth: {},
};
const securityURI = {};

module.exports = {
	name: "api",
	mixins: [
		ApiGateway,
		ApolloService({
			// Global GraphQL typeDefs
			typeDefs: require("./graphql/type"),

			// Global resolvers
			resolvers: require("./graphql/resolvers"),

			// API Gateway route options
			routeOptions: {
				path: "/graphql",
				cors: true,
				mappingPolicy: "restrict",
				authentication: true,
				authorization: true,
				auth: {
					strategies: ["jwt", "admin"],
					mode: "optional",
				},
			},

			// https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
			serverOptions: {
				tracing: true,
			},
		}),
	],

	dependencies: [
		/* 'security' */
	],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT,
		// Exposed IP
		ip: process.env.IP,

		customs: {
			hooks: {
				async onRequest(req, res) {
					await require("./hooks/onRequest.hook")(
						req,
						res,
						instance.securityURI
					);
				},
				onPreResponse: require("./hooks/onPreResponse.hook"),
				onHasBody: require("./hooks/onHasBody.hook"),
			},
		},

		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: [
				"*",
				"Content-Type",
				"x-api-key",
				"x-api-validate",
				"x-api-action",
				"x-api-client",
				"x-request-id",
				"Authorization",
			],
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [
				"*",
				"x-api-key",
				"x-api-validate",
				"x-api-action",
				"x-api-client",
			],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: true,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600,
		},

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/",
				whitelist: ["**"],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: false,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "restrict", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: "null",

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		reformatError: require("./methods/reformatError.method"),
		async authenticate(ctx, route, req) {
			const response = await require("./methods/authenticate.method")(
				ctx,
				route,
				req,
				instance.auth
			);
			return response;
		},
		authorize: require("./methods/authorize.method"),
	},
	events: {
		"$services.changed": function (ctx) {
			instance.securityURI = require("./events/$services.changed.event")(
				ctx
			).securityURI;
			instance.auth = require("./events/$services.changed.event")(
				ctx
			).auth;
		},
	},
};
