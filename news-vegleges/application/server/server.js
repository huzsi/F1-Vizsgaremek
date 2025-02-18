const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Statikus fájlok beállítása
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

// Az oldal indulásakor a start.html-re dob
app.get('/', (req, res) => res.redirect('/start.html'));

// Új GET végpont az index.html-nek
app.get('/index.html', servePage('index'));
app.get('/about.html', servePage('about'));
app.get('/auth.html', servePage('auth'));
app.get('/tracks.html', servePage('tracks'));
app.get('/newsCreator.html', servePage('newsCreator'));
app.get('/resultUpload.html', servePage('resultUpload'));
app.get('/start.html', servePage('start'));

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
// Új API végpont a seasonRaceResults tábla adatainak lekéréséhez
app.get('/seasonRaceResults', (req, res) => {
    const query = `SELECT * FROM seasonRaceResult`;
    queryDB(res, query);
});

app.post('/saveRaceResults', (req, res) => {
    const { raceId, results } = req.body;
    const query = `
      INSERT INTO seasonRaceResult (raceId, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        raceId,
        results.P1 || null,
        results.P2 || null,
        results.P3 || null,
        results.P4 || null,
        results.P5 || null,
        results.P6 || null,
        results.P7 || null,
        results.P8 || null,
        results.P9 || null,
        results.P10 || null,
        results.P11 || null,
        results.P12 || null,
        results.P13 || null,
        results.P14 || null,
        results.P15 || null,
        results.P16 || null,
        results.P17 || null,
        results.P18 || null,
        results.P19 || null,
        results.P20 || null,
    ];
    queryDB(res, query, values);
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const query = 'INSERT INTO user (usernames, emails, passwords) VALUES (?, ?, ?)';
    conn.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user', error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user WHERE emails = ?';
  conn.query(query, [email], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error checking user in the database', error: err.message });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const user = result[0];

      bcrypt.compare(password, user.passwords, (err, isMatch) => {
          if (err) {
              return res.status(500).json({ message: 'Error comparing passwords', error: err.message });
          }

          if (!isMatch) {
              return res.status(401).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ id: user.id, username: user.usernames }, 'secret_key', { expiresIn: '1h' });
          res.json({ token });
      });
  });
});

app.get('/check-auth', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ loggedIn: false });
  }

  jwt.verify(token, 'secret_key', (err, decoded) => {
      if (err) {
          return res.status(401).json({ loggedIn: false });
      }
      res.json({ loggedIn: true, username: decoded.username });
  });
});

app.listen(port, () => console.log(`Server is running at: http://localhost:${port}`));
