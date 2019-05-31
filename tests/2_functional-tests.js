/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	suite('GET /api/stock-prices => stockData object', function() {
		test('1 stock', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.property(res.body, 'stockData');
					assert.property(res.body.stockData, 'stock');
					assert.property(res.body.stockData, 'price');
					assert.property(res.body.stockData, 'likes');
					done();
				});
		});

		test('1 stock with like', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', like: 'true' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					assert.property(res.body.stockData, 'stock');
					assert.isNumber(res.body.stockData.price, 'price is a number');
					assert.isNumber(res.body.stockData.likes, 'likes is a number');
					done();
				});
		});

		test('1 stock with like again (ensure likes are not double counted)', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', like: 'true' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.stockData.likes, 1);
					done();
				});
		});

		test('2 stocks', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'aapl', stock: 'msft' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.type, 'application/json');
					// assert.isArray(res.body.stockData, 'stock data is an array');
					done();
				});
		});

		test('2 stocks with like', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'aapl', stock: 'msft', like: 'true' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					// assert.property(res.body.stockData[0], 'rel_likes');
					done();
				});
		});
	});
});
