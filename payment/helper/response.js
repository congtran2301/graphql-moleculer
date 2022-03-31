const response = ({ message = '', data = null, code }) => {
	return {
		message,
		error: false,
		code,
		data,
	};
};

module.exports = { response };
