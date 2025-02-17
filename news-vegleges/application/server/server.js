const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Statikus fájlok beállítása
app.use('/static', express.static(path.join(__dirname, 'public')));

// MySQL kapcsolat
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'racecalendar'
});
conn.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Egységes függvény az adatbázis-lekérdezésekhez
const queryDB = (res, query, params = []) => {
    conn.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length === 1 ? results[0] : results);
    });
};

// HTML oldalak kiszolgálása dinamikusan
const servePage = (page) => (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));

app.get('/', servePage('index'));
app.get('/about.html', servePage('about'));
app.get('/auth.html', servePage('auth'));
app.get('/tracks.html', servePage('tracks'));
app.get('/newsCreator.html', servePage('newsCreator'));

// API végpontok
app.get('/racenames', (req, res) => {
    queryDB(res, 'SELECT raceNumber, id, name, fullName, trackName FROM racenames ORDER BY raceNumber ASC');
});

app.get('/race-schedule', (req, res) => {
    queryDB(res, `
        SELECT rd.id, rd.type, rd.event1, rd.event2, rd.event3, rd.event4, rd.event5, 
               rn.name, rn.fullName, rn.trackName, rn.raceNumber 
        FROM racedates rd 
        JOIN racenames rn ON rd.id = rn.id 
        ORDER BY rn.raceNumber ASC
    `);
});
app.get('/trackinfo', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT trackName, fullName FROM racenames WHERE id = ?', [req.query.id]);
});
app.get('/circuitdatas', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT firstGP, lapNumber, length, raceDistance, record, driver, recordYear FROM circuitdatas WHERE id = ?', [req.query.id]);
});
app.get('/driverStandlist', (req, res) => {
    const query = `SELECT driverId,driverName,constructor FROM standlist`;
    queryDB(res, query);
});
app.get('/constructorStandlist', (req, res) => {
    const query = `SELECT DISTINCT constructorName, standlist.constructor FROM constructornames INNER JOIN standlist ON constructornames.constructorId = standlist.constructorId`;
    queryDB(res, query);
});
// Szerver indítása
app.listen(port, () => console.log(`Server is running at: http://localhost:${port}`));
