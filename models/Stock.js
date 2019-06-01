const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
	symbol: String,
	price: Number,
	likes: [{ user_ip: String }]
});

module.exports = mongoose.model('Stock', StockSchema);
