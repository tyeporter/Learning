const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const { Liquid } = require('liquidjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const engine = new Liquid();

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid');

const colors = ['#F3DCD4', '#ECC9C7', '#D9E3DA', '#D1CFC0', '#C2C2B4'];
const randomIndex = Math.floor(Math.random() * colors.length)

app.get('/', (req, res) => {
    res.render('index.liquid', { color: colors[randomIndex] });
});

const server = app.listen(PORT, () => {
    const port = server.address().port;
	console.log(chalk.yellow(`Application running on http://localhost:${port}`));
});
