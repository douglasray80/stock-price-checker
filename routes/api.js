/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const stockHandler = require('../controllers/stockHandler');

module.exports = function(app) {
	app.route('/api/stock-prices').get(async (req, res, next) => {
		const stock_symbol = req.query.stock;
		const like = req.query.like;
		const user_ip = req.ip;

		try {
			const stockData = await stockHandler(stock_symbol, like, user_ip);
			res.json({ stockData });
		} catch (err) {
			next(err);
		}
	});
};
