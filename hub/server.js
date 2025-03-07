//Modulok amiket a weboldal használ
const express = require("express");
const corse = require(`cors`);
const path = require('path');
const app = express();

//Weboldal Helyi portja
const port = 3000;

// Érje el a weboldalt a http://localhost:3000 címen
app.use('/static', express.static(path.join(__dirname, 'client'))); 

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Statikus fájlok kiszolgálása (Client mappa)
app.use(express.static("client"));

// Indítsd el a szervert
app.listen(port, () => {
  console.log(`Website is running in: http://localhost:${port}`);
});

// Exportáljuk az app-ot, hogy a server.js-ben használni tudjuk
module.exports = app;