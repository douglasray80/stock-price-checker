const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
	stock: String,
	price: Number,
	likes: [{ ip: String }]
});

module.exports = mongoose.model('Stock', StockSchema);
