const express = require('express');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configure options
const options = {
    hostname: 'dog.ceo',
    path: '/api/breeds/image/random',
    method: 'GET',
    headers: {
        Accept: 'application/json'
    }
};

// Configure middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/build')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => {
    const request = https.request(options, resp => {
        resp.on('data', data => {
            res.send(JSON.parse(data.toString()));
        });
    });

    request.on('error', err => {
        console.log(chalk.red(err));
    });

    request.end();
});

const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(chalk.yellow(`Listening at http://localhost:${port}`));
});

