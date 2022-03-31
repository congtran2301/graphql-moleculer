const _ = require('lodash');
const { nanoid } = require('nanoid');
const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const md5 = require('md5');
const securityConstant = require('../constants/security.constant');

module.exports = async function (req, res, content) {
	try {
		const accessToken = _.get(req.headers, 'authorization', '');
		if (!req.security) return content;
		if (req.security.type === securityConstant.TYPE.CHECKSUM) {
			const objValidate = {
				pathUrl: req.url,
				method: _.toUpper(req.method),
				accessToken,
				content
			};
			const xAPIValidate = md5(_.values(objValidate).join('') + req.security.secretKey);
			res.setHeader('x-api-validate', xAPIValidate);
			return content;
		}
		const xAPIClient = req.headers['x-api-client'];
		const xAPIAction = req.headers['x-api-action'];
		const { rsaKey } = req.security;
		const encryptKey = nanoid();
		const key = new NodeRSA(rsaKey.publicKey);
		const xAPIKey = key.encrypt(encryptKey, 'base64');
		const xApiMessage = CryptoJS.AES.encrypt(content, encryptKey).toString();

		const objValidate = {
			'x-api-action': xAPIAction,
			method: _.toUpper(req.method),
			accessToken,
			'x-api-message': xApiMessage
		};
		const xAPIValidate = md5(_.values(objValidate).join('') + encryptKey);
		res.setHeader('x-api-key', xAPIKey);
		res.setHeader('x-api-client', xAPIClient);
		res.setHeader('x-api-action', xAPIAction);
		res.setHeader('x-api-validate', xAPIValidate);
		return JSON.stringify({
			'x-api-message': xApiMessage
		});
	} catch (error) {
		return content;
	}
};
