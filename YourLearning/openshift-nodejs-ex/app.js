const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
	res.send('Hello, OpenShift from nodejs!');
});

const server = app.listen(PORT, () => {
    const port = server.address().port;
	console.log(chalk.yellow(`Application running on http://localhost:${port}`));
});

