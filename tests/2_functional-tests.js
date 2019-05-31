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
				.query({ stock: 'goog', like: true })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					done();
				});
		});

		test('1 stock with like again (ensure likes arent double counted)', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', like: true })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					done();
				});
		});

		test('2 stocks', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', stock: 'amd' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					done();
				});
		});

		test('2 stocks with like', function(done) {
			chai
				.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', stock: 'amd', like: true })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					done();
				});
		});
	});
});
