/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

module.exports = function(app) {
	app.route('/api/stock-prices').get(function(req, res) {
		const stock = req.query.stock;
		const like = req.query.like;
		const ipAddress = req.ip;
	});
};
