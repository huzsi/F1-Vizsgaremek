//Modulok amiket a weboldal használ
const express = require("express");
const corse = require(`cors`);
const path = require('path');
const app = express();

//Weboldal Helyi portja
const port = 3001;

const pilotStats = require('./pilotStats'); //pilotStats.js
//const constructorStats = require('./constructorStats');
const otherStats = require('./otherStats'); //otherStats.js

app.use('/static', express.static(path.join(__dirname, 'client'))); 

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});
app.get('/about.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'about.html'));
});
app.get('/auth.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'client', 'auth.html'));
});
app.get('/tracks.html', function(req, res){
    res.sendFile(path.join(__dirname, 'client', 'tracks.html'));
})

/* =============== 
PILÓTA STATISZTIKA
=============== */

// Az /api/pilotList végpont
app.get('/api/pilotList', (req, res) => {
  pilotStats.getQueryResults('pilotList', res);
});

// Az /api/raceStarts végpont
app.get('/api/raceStarts', (req, res) => {
  pilotStats.getQueryResults('raceStarts', res);
});

// Az /api/championshipStandings végpont
app.get('/api/championshipStandings', (req, res) => {
  pilotStats.getQueryResults('championshipStandings', res);
});

// Az /api/raceWins végpont
app.get('/api/raceWins', (req, res) => {
  pilotStats.getQueryResults('raceWins', res);
});

// Az /api/podiums végpont
app.get('/api/podiums', (req, res) => {
  pilotStats.getQueryResults('podiums', res);
});

// Az /api/polePositions végpont
app.get('/api/polePositions', (req, res) => {
  pilotStats.getQueryResults('polePositions', res);
});

// Az /api/points végpont
app.get('/api/points', (req, res) => {
  pilotStats.getQueryResults('points', res);
});


/* =============== 
EGYÉB STATISZTIKÁK 
=============== */

// Versenyek adatainak lekérdezése év szerint
app.get('/races/:year', (req, res) => {
  const year = req.params.year;
  otherStats.getQueryResults('racesByYear', year, res);
});

// Egy szezon statisztikáinak lekérdezése
app.get('/api/seasonStats', (req, res) => {
  const year = req.query.year;
  otherStats.getQueryResults('seasonStats', year, res);
});

// Egy verseny statisztikáinak lekérdezése
app.get('/api/raceResults?raceId=${raceId}', (req, res) => {
  const year = req.query.year;
  otherStats.getQueryResults('getRaceResults', year, res);
});

// Statikus fájlok kiszolgálása (Client mappa)
app.use(express.static("client"));

// Indítsd el a szervert
app.listen(port, () => {
  console.log(`Website is running in: http://localhost:${port}`);
});

module.exports = app;