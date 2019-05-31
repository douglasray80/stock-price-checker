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
				const response = [];

				for (let i = 0; i < stock_symbol.length; i++) {
					let stock = await StockService.getStock(stock_symbol[i]);

					if (like) stock = await StockService.likeStock(stock._id, user_ip);

					response.push({
						stock: stock.symbol,
						price: stock.price,
						rel_likes: stock.likes.length
					});
				}

				const difference = Math.abs(
					response[0].rel_likes - response[1].rel_likes
				);

				if (response[0].rel_likes > response[1].rel_likes) {
					response[0].rel_likes = difference;
					response[1].rel_likes = -difference;
				} else {
					response[0].rel_likes = -difference;
					response[1].rel_likes = difference;
				}

				res.json({ stockData: response });
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
