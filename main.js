const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config(); // .env fájl beolvasása

// Importáljuk az al-szervereket (ezek mind külön porton futnak)
const hubServer = require('./hub/server');
const statisticsServer = require('./statistics/server');
const newsServer = require('./news/server');

// Átirányítás a megfelelő al-szerverekhez
app.use('/', hubServer);                   // 3000 port
app.use('/statistics', statisticsServer);  // 3001 port
app.use('/news', newsServer);              // 3002 port