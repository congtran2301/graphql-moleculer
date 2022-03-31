const NodeRSA = require('node-rsa');
const _ = require('lodash');
const Axios = require('axios');
const CryptoJS = require('crypto-js');
const ShortId = require('shortid');
const Md5 = require('md5');

class MeAPI {
	constructor(config = {
		url: '',
		publicKey: '',
		privateKey: '',
		isSecurity: false,
		'x-api-client': '',
	}) {
		this.config = config;
	}

	ResponseDecrypt(xAPIAction, method, xAPIClient, xAPIKey, xAPIMessage, xAPIValidate, accessToken) {
		let encryptKey;
		try {
			const key = new NodeRSA(this.config.privateKey);
			encryptKey = key.decrypt(xAPIKey, 'utf8');
		} catch (error) {
			throw new Error('Thông tin "x-api-key" không chính xác');
		}
		const objValidate = {
			'x-api-action': xAPIAction,
			method,
			accessToken,
			'x-api-message': xAPIMessage,
		};
		const validate = Md5(_.values(objValidate).join('') + encryptKey);
		if (validate !== xAPIValidate) {
			throw new Error('Thông tin "x-api-validate" không chính xác');
		}
		let result = null;
		try {
			result = JSON.parse(CryptoJS.AES.decrypt(xAPIMessage, encryptKey).toString(CryptoJS.enc.Utf8));
		} catch (error) {
			throw new Error('Thông tin "x-api-message" không chính xác');
		}
		return result;
	}

	RequestEncrypt(url, method, payload, accessToken) {
		const encryptKey = ShortId.generate();
		const key = new NodeRSA(this.config.publicKey);
		const xAPIKey = key.encrypt(encryptKey, 'base64');
		let body = '';
		const xApiAction = CryptoJS.AES.encrypt(url, encryptKey).toString();
		let xApiMessage = '';
		if (payload) {
			xApiMessage = CryptoJS.AES.encrypt(JSON.stringify(payload), encryptKey).toString();
		}
		const objValidate = {
			xApiAction,
			method,
			accessToken,
			'x-api-message': xApiMessage,
		};
		const xAPIValidate = Md5(_.values(objValidate).join('') + encryptKey);
		body = {
			'x-api-message': xApiMessage,
		};
		const meAPIHeader = {
			'x-api-client': this.config['x-api-client'],
			'x-api-key': xAPIKey,
			'x-api-action': xApiAction,
			'x-api-validate': xAPIValidate,
		};
		if (accessToken !== '') {
			meAPIHeader.Authorization = accessToken;
		}
		return {
			body,
			headers: meAPIHeader,
		};
	}

	async Post(pathUrl, payload, accessToken = '', headers = {}) {
		const result = {
			code: -1,
			data: {},
			original: null,
		};
		try {
			if (_.isNull(accessToken)) accessToken = '';
			let meAPIHeader = {};
			if (accessToken !== '') {
				meAPIHeader.Authorization = accessToken;
			}
			let body = payload;
			let url = this.config.url + pathUrl;
			if (this.config.isSecurity === true) {
				url = this.config.url;
				const encrypt = this.RequestEncrypt(
					pathUrl,
					'POST',
					payload,
					accessToken,
				);
				meAPIHeader = encrypt.headers;
				body = encrypt.body;
			}
			console.log('url', url);

			// console.log(body, _.merge(meAPIHeader, headers));
			const response = await Axios.post(url, body, {
				headers: _.merge(meAPIHeader, headers),
			});
			// console.log('response', response);
			if (response.code !== 200) {
				result.code = -response.code;
				result.data = {};
				result.original = response.data;
			}
			let { data } = response;
			if (this.config.isSecurity === true) {
				try {
					const responseHeaders = response.headers;
					data = this.ResponseDecrypt(
						responseHeaders['x-api-action'],
						'POST',
						responseHeaders['x-api-client'],
						responseHeaders['x-api-key'],
						response.data['x-api-message'],
						responseHeaders['x-api-validate'],
						accessToken,
					);
				} catch (error) {
					return {
						code: -1,
						data: {
							code: error.code,
							message: error.message,
						},
						original: response.data,
					};
				}
			}
			return {
				code: 1,
				data,
				original: response.data,
			};
		} catch (error) {
			return {
				code: -2,
				data: {
					message: error.message,
				},
				original: error,
			};
		}
	}

	async Get(pathUrl, accessToken = '', headers = {}) {
		const result = {
			code: -1,
			data: {},
			original: null,
		};
		try {
			if (_.isNull(accessToken)) accessToken = '';
			let meAPIHeader = {};
			if (accessToken !== '') {
				meAPIHeader.Authorization = accessToken;
			}
			let url = this.config.url + pathUrl;
			if (this.config.isSecurity === true) {
				url = this.config.url;
				const encrypt = this.RequestEncrypt(
					pathUrl,
					'GET',
					'',
					accessToken,
				);
				meAPIHeader = encrypt.headers;
			}
			const response = await Axios.get(url, {
				headers: _.merge(meAPIHeader, headers),
			});
			if (response.code !== 200) {
				result.code = -response.code;
				result.data = {};
				result.original = response.data;
			}
			let { data } = response;
			if (this.config.isSecurity === true) {
				try {
					const responseHeaders = response.headers;
					data = this.ResponseDecrypt(
						responseHeaders['x-api-action'],
						'GET',
						responseHeaders['x-api-client'],
						responseHeaders['x-api-key'],
						response.data['x-api-message'],
						responseHeaders['x-api-validate'],
						accessToken,
					);
				} catch (error) {
					return {
						code: -1,
						data: {
							message: error.message,
						},
						original: response.data,
					};
				}
			}
			return {
				code: 1,
				data,
				original: response.data,
			};
		} catch (error) {
			return {
				code: -2,
				data: {
					code: error.code,
					message: error.message,
				},
				original: error,
			};
		}
	}

	async Put(pathUrl, accessToken = '', headers = {}) {
		const result = {
			code: -1,
			data: {},
			original: null,
		};
		try {
			if (_.isNull(accessToken)) accessToken = '';
			let meAPIHeader = {};
			if (accessToken !== '') {
				meAPIHeader.Authorization = accessToken;
			}
			let url = this.config.url + pathUrl;
			if (this.config.isSecurity === true) {
				url = this.config.url;
				const encrypt = this.RequestEncrypt(
					pathUrl,
					'PUT',
					'',
					accessToken,
				);
				meAPIHeader = encrypt.headers;
			}
			const response = await Axios.put(url, {
				headers: _.merge(meAPIHeader, headers),
			});
			if (response.code !== 200) {
				result.code = -response.code;
				result.data = {};
				result.original = response.data;
			}
			let { data } = response;
			if (this.config.isSecurity === true) {
				try {
					const responseHeaders = response.headers;
					data = this.ResponseDecrypt(
						responseHeaders['x-api-action'],
						'PUT',
						responseHeaders['x-api-client'],
						responseHeaders['x-api-key'],
						response.data['x-api-message'],
						responseHeaders['x-api-validate'],
						accessToken,
					);
				} catch (error) {
					return {
						code: -1,
						data: {
							message: error.message,
						},
						original: response.data,
					};
				}
			}
			return {
				code: 1,
				data,
				original: response.data,
			};
		} catch (error) {
			return {
				code: -2,
				data: {
					code: error.code,
					message: error.message,
				},
				original: error,
			};
		}
	}

	async Delete(pathUrl, payload, accessToken = '', headers = {}) {
		const result = {
			code: -1,
			data: {},
			original: null,
		};
		try {
			if (_.isNull(accessToken)) accessToken = '';
			let meAPIHeader = {};
			if (accessToken !== '') {
				meAPIHeader.Authorization = accessToken;
			}
			let body = payload;
			let url = this.config.url + pathUrl;
			if (this.config.isSecurity === true) {
				url = this.config.url;
				const encrypt = this.RequestEncrypt(
					pathUrl,
					'DELETE',
					payload,
					accessToken,
				);
				meAPIHeader = encrypt.headers;
				body = encrypt.body;
			}

			// console.log(body, _.merge(meAPIHeader, headers));
			const response = await Axios.delete(url, {
				headers: _.merge(meAPIHeader, headers),
				timeout: 30000,
				data: body,
			});
			// console.log('pathUrl', pathUrl);
			// console.log('response', response);
			if (response.code !== 200) {
				result.code = -response.code;
				result.data = {};
				result.original = response.data;
			}
			let { data } = response;
			if (this.config.isSecurity === true) {
				try {
					const responseHeaders = response.headers;
					data = this.ResponseDecrypt(
						responseHeaders['x-api-action'],
						'DELETE',
						responseHeaders['x-api-client'],
						responseHeaders['x-api-key'],
						response.data['x-api-message'],
						responseHeaders['x-api-validate'],
						accessToken,
					);
				} catch (error) {
					return {
						code: -1,
						data: {
							message: error.message,
						},
						original: response.data,
					};
				}
			}
			return {
				code: 1,
				data,
				original: response.data,
			};
		} catch (error) {
			return {
				code: -2,
				data: {
					code: error.code,
					message: error.message,
				},
				original: error,
			};
		}
	}
}

module.exports = MeAPI;
