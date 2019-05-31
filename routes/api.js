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
		const user_ip = req.ip;

		try {
			if (Array.isArray(stock_symbol)) {
				const stocks = await stock_symbol.reduce(async (newArr, symbol) => {
					let stock = await StockService.getStock(symbol);

					if (like) stock = await StockService.likeStock(stock._id, user_ip);

					const arr = await newArr;

					arr.push({
						stock: stock.symbol,
						price: stock.price,
						likes: stock.likes.length
					});

					return arr;
				}, []);

				res.json({ stockData: stocks });
			} else {
				let stock = await StockService.getStock(stock_symbol);

				if (like) stock = await StockService.likeStock(stock._id, user_ip);

				res.json({
					stockData: {
						stock: stock.symbol,
						price: stock.price,
						likes: stock.likes.length
					}
				});
			}
		} catch (err) {
			next(err);
		}
	});
};
