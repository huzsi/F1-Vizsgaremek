const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'racebet'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.use('/static', express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'bet.html'));
});

app.get('/constructors', (req, res) => {
    const query = 
        `
        SELECT constructors.name AS constructorName, p1.fullName AS pilot1Name, p2.fullName AS pilot2Name
        FROM constructors
        JOIN pilot p1 ON constructors.pilotId1 = p1.pilotId
        JOIN pilot p2 ON constructors.pilotId2 = p2.pilotId
    `;
    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
