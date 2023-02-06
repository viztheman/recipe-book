const {API_KEY} = process.env;

module.exports = () => (req, res, next) => {
	const authorization = req.get('Authorization') || '';
	const tokens = authorization.split(' ');

	if (
		tokens.length < 2
		|| tokens[0] != 'Bearer'
		|| tokens[1] != API_KEY
	)
	{
		return res.status(400).end();
	}
	next();
};
