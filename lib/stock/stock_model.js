const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
	symbol: String,
	price: Number,
	likes: [{ ip_address: String }]
});

module.exports = mongoose.model('Stock', StockSchema);
