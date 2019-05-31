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

	const stock = await Stock.findOne({ symbol });

	if (!stock) {
		const newStock = new Stock({ symbol, price });
		return newStock.save();
	}

	return stock;
};

const likeStock = Stock => async (stock_id, user_ip) => {
	if (!stock_id || !user_ip)
		throw new Error(`Stock: ${stock_id}, IP: ${user_ip}`);

	const stock = await Stock.findById(stock_id);
	const isLiked = stock.likes.find(like => like.user_ip === user_ip);

	if (isLiked) throw new Error(`User has already liked this stock`);

	stock.likes.push({ user_ip });

	return stock.save();
};

module.exports = Stock => {
	return {
		getStock: getStock(Stock),
		likeStock: likeStock(Stock)
	};
};
