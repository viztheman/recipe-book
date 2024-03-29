require('dotenv').config();
const {PORT} = process.env;

const express = require('express');
const path = require('path');
const apiKey = require('./lib/apikey');
const cors = require('cors');

const app = express();
app.set('view engine', 'pug');
app.use(cors());
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/', require('./lib/routers/web/root'));
app.use('/api', apiKey(), require('./lib/routers/api/recipes'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
