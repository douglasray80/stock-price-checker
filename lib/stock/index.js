const StockModel = require('./stock_model');
const StockService = require('./stock_service');

module.exports = StockService(StockModel);
