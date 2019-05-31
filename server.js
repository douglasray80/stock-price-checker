'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

const apiRoutes = require('./routes/api');
const fccTestingRoutes = require('./routes/fcctesting');

const app = express();
const runner = require('./test-runner');

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'", "'unsafe-inline'", 'code.jquery.com'],
			imgSrc: ["'self'", , 'hyperdev.com', 'glitch.com']
		}
	})
);

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/').get((req, res) => {
	res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use((req, res, next) => {
	res.status(404).json({ error: 'not found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + process.env.PORT);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function() {
			try {
				runner.run();
			} catch (e) {
				var error = e;
				console.log('Tests are not valid:');
				console.log(error);
			}
		}, 4000);
	} else {
		app.use(morgan('dev'));
	}
});

module.exports = app;
