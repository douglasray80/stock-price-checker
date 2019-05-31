const fetch = require('node-fetch');

// fetch the stock data from external api
const getCurrentPrice = async stock_symbol => {
	const response = await fetch(
		`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock_symbol}&apikey=${
			process.env.ALPHA_VANTAGE_API_KEY
		}`
	);
	const data = await response.json();
	const stock_price = data['Global Quote']['05. price'];

	return stock_price;
};

const getStock = Stock => async (stock_symbol, user_ip_address) => {
	if (!stock_symbol) throw new Error(`Stock: ${stock_symbol}`);

	const symbol = stock_symbol.toUpperCase();
	const price = await getCurrentPrice(symbol);

	const stock = await Stock.findOne({ symbol })
		.select('-_id -__v')
		.lean();

	if (!stock) {
		const newStock = new Stock({ symbol, price });
		return newStock.save();
	}

	return stock;
};

const likeStock = Stock => async (stock_symbol, ip_address) => {
	if (!stock_symbol || !ip_address)
		throw new Error(`Stock: ${stock_symbol}, IP: ${ip_address}`);

	const symbol = stock_symbol.toUpperCase();

	const likedStock = await Stock.findOne({
		symbol,
		likes: { ip: ip_address }
	});

	if (!likedStock) {
		const stock = await Stock.findOne({ symbol });
		stock.likes.push({ ip_address });
		return stock.save();
	}

	return null;
};

module.exports = Stock => {
	return {
		getStock: getStock(Stock),
		likeStock: likeStock(Stock)
	};
};
