const fetch = require('node-fetch');
const Stock = require('../models/Stock');

// fetch the stock data from external api
// WARNING: api rate limit -- 5 calls per minute, 500 calls per day!
const getCurrentPrice = async stock_symbol => {
	const response = await fetch(
		`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock_symbol}&apikey=${
			process.env.ALPHA_VANTAGE_API_KEY
		}`
	);
	const data = await response.json();
	const stock_price = data['Global Quote'] && data['Global Quote']['05. price'];
	if (!stock_price) throw new Error('rate limit exceeded');

	return stock_price;
};

const calculateDifference = arr => {
	let num1 = arr[0]['rel_likes'];
	let num2 = arr[1]['rel_likes'];

	const diff = Math.abs(num1 - num2);

	if (num1 > num2) {
		num1 = diff;
		num2 = -diff;
	} else {
		num1 = -diff;
		num2 = diff;
	}

	return [{ ...arr[0], rel_likes: num1 }, { ...arr[1], rel_likes: num2 }];
};

const getStock = async stock_symbol => {
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

const likeStock = async (stock_id, user_ip) => {
	if (!stock_id || !user_ip)
		throw new Error(`Stock: ${stock_id}, IP: ${user_ip}`);

	const stock = await Stock.findById(stock_id);
	const isLiked = stock.likes.find(like => like.user_ip === user_ip);

	if (isLiked) {
		return stock;
	} else {
		stock.likes.push({ user_ip });
		return stock.save();
	}
};

const stockHandler = async (stock_query, like, user_ip) => {
	if (Array.isArray(stock_query)) {
		const data = [];

		for (let i = 0; i < stock_query.length; i++) {
			let stock = await getStock(stock_query[i]);

			if (like) stock = await likeStock(stock._id, user_ip);

			data.push({
				stock: stock.symbol,
				price: stock.price,
				rel_likes: stock.likes.length
			});
		}

		const response = calculateDifference(data);

		return response;
	} else {
		let stock = await getStock(stock_query);

		if (like) stock = await likeStock(stock._id, user_ip);

		return {
			stock: stock.symbol,
			price: stock.price,
			likes: stock.likes.length
		};
	}
};

module.exports = stockHandler;
