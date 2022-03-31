const _ = require("lodash");
const NodeRSA = require("node-rsa");
const CryptoJS = require("crypto-js");
const { MoleculerError } = require("moleculer").Errors;
const securityConstant = require("../constants/security.constant");

module.exports = async function (req, res, securityURI) {
	const ctx = req.$ctx;
	if (process.env.SECURITY === "false") return false;
	const securityBypass = _.values(securityURI);
	let securityFlag = true;
	_.forEach(securityBypass, (v) => {
		const m = v.exec(req.url);
		if (m) {
			securityFlag = false;
			return false;
		}
		return true;
	});
	if (securityFlag === false) return false;
	if (process.env.SECURITY_BYPASS) {
		if (req.headers.security === process.env.SECURITY_BYPASS) {
			return false;
		}
	}
	const xAPIKey = req.headers["x-api-key"];
	const xAPIClient = req.headers["x-api-client"] || "";
	const xAPIAction = req.headers["x-api-action"];

	const securityInfo = await ctx.broker.call("security.pick", {
		xAPIClient,
	});

	if (
		_.get(securityInfo, "securityType", "RSA") ===
		securityConstant.TYPE.CHECKSUM
	) {
		req.security = {
			type: securityConstant.TYPE.CHECKSUM,
			info: _.omit(securityInfo, ["securityType", "secretKey"]),
			secretKey: securityInfo.secretKey,
		};
		return true;
	}

	const rsaKey = securityInfo;
	if (!rsaKey) {
		throw new MoleculerError(
			"Thông tin mã hóa không chính xác (-2)",
			400,
			null,
			null
		);
	}

	let encryptKey;
	try {
		const key = new NodeRSA(rsaKey.privateKey);
		encryptKey = key.decrypt(xAPIKey, "utf8");
		if (!encryptKey) {
			throw new MoleculerError(
				"Thông tin mã hóa không chính xác (-3)",
				400,
				null,
				null
			);
		}
	} catch (error) {
		throw new MoleculerError(
			"Thông tin mã hóa không chính xác (-4)",
			400,
			null,
			null
		);
	}

	let uri = null;
	try {
		uri = CryptoJS.AES.decrypt(xAPIAction, encryptKey).toString(
			CryptoJS.enc.Utf8
		);
	} catch (error) {
		throw new MoleculerError(
			"Thông tin mã hóa không chính xác (-5)",
			400,
			null,
			null
		);
	}
	req.url = uri;
	// console.log('Decrypted Request', encryptKey, uri);
	req.security = {
		type: securityConstant.TYPE.RSA,
		info: _.omit(securityInfo, ["securityType", "publicKey", "privateKey"]),
		rsaKey,
		encryptKey,
	};
	return true;
};
