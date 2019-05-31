/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const StockService = require('../lib/stock');

module.exports = function(app) {
	app.route('/api/stock-prices').get(async (req, res, next) => {
		const stock_symbol = req.query.stock;
		const like = req.query.like;
		const ipAddress = req.ip;

		try {
			const stock = await StockService.getStock(stock_symbol);

			if (like) await StockService.likeStock(stock_symbol, ipAddress);

			res.json({ stockData: stock });
		} catch (err) {
			next(err);
		}
	});
};
