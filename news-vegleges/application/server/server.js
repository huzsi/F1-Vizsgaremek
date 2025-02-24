const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const apiKey = 'dbe6c673af274063be29c9aa0d09e5ed';
(async () => {
    const fetch = await import('node-fetch');
    const response = await fetch.default(`https://newsapi.org/v2/everything?q=Formula%201&apiKey=${apiKey}`);
    const data = await response.json();
})();

const app = express();
const port = process.env.PORT || 3001;

const newsUrl = `https://newsapi.org/v2/everything?q=Formula%201&apiKey=${apiKey}`;

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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

const queryDB = (res, query, params = []) => {
    conn.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length === 1 ? results[0] : results);
    });
};

const authorize = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};
const servePage = (page) => (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));
app.get('/', servePage('start'));
app.get('/news/index.html', servePage('index'));
app.get('/news/about.html', servePage('about'));
app.get('/news/auth.html', servePage('auth'));
app.get('/news/tracks.html', servePage('tracks'));
app.get('/news/start.html', servePage('start'));
app.get('/news/profile.html', servePage('profile'));

app.get('/news/news', async (req, res) => {
    try {
        const response = await fetch(newsUrl);
        if (!response.ok) {
            throw new Error(`API kérés hiba: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status === 'ok') {
            res.json(data.articles);
        } else {
            res.status(500).json({ error: 'Hiba történt a hírek lekérése során' });
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        res.status(500).json({ error: 'Hálózati hiba történt' });
    }
});
app.get('/news/news-layout.html/:page', (req, res) => {
    const { page } = req.params;
    let filePath = path.join(__dirname, 'public', 'html', 'news-layout.html');

    if (page === 'article' || page === 'tech-news' || page === 'regular-news') {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});
app.get('/news/script-layout.html/:page', (req, res) => {
    const { page } = req.params;
    let filePath = path.join(__dirname, 'public', 'html', 'script-layout.html');

    if (page === 'news-creator' || page === 'result-uploader') {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

app.get('/news/race-schedule', (req, res) => {
    queryDB(res, `
        SELECT rd.id, rd.type, rd.event1, rd.event2, rd.event3, rd.event4, rd.event5, 
               rn.name, rn.fullName, rn.trackName, rn.raceNumber 
        FROM racedates rd 
        JOIN racenames rn ON rd.id = rn.id 
        ORDER BY rn.raceNumber ASC
    `);
});

app.get('/news/trackinfo', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT trackName, fullName FROM racenames WHERE id = ?', [req.query.id]);
});
app.get('/news/racenames', (req, res) =>{
    queryDB(res,'SELECT raceNumber, id, name, fullName, trackName FROM racenames ORDER BY raceNumber ASC',[req.query.id]);
});
app.get('/news/circuitdatas', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT firstGP, lapNumber, length, raceDistance, record, driver, recordYear FROM circuitdatas WHERE id = ?', [req.query.id]);
});

app.get('/news/driverStandlist', (req, res) => {
    queryDB(res, `SELECT driverId,driverName,constructor FROM standlist`);
});

app.get('/news/constructorStandlist', (req, res) => {
    queryDB(res, `SELECT DISTINCT constructorName, standlist.constructor FROM constructornames INNER JOIN standlist ON constructornames.constructorId = standlist.constructorId`);
});

app.get('/news/seasonRaceResults', (req, res) => {
    queryDB(res, `SELECT * FROM seasonRaceResult`);
});

app.post('/news/saveRaceResults', (req, res) => {
    const { raceId, results } = req.body;
    const query = `
        INSERT INTO seasonRaceResult (raceId, P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15, P16, P17, P18, P19, P20)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        raceId,
        results.P1 || null, results.P2 || null, results.P3 || null, results.P4 || null, results.P5 || null, 
        results.P6 || null, results.P7 || null, results.P8 || null, results.P9 || null, results.P10 || null,
        results.P11 || null, results.P12 || null, results.P13 || null, results.P14 || null, results.P15 || null,
        results.P16 || null, results.P17 || null, results.P18 || null, results.P19 || null, results.P20 || null,
    ];
    queryDB(res, query, values);
});

app.post('/news/register', (req, res) => {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const query = 'INSERT INTO user (permission,usernames, emails, passwords) VALUES (3,?, ?, ?)';
        conn.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error registering user', error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/news/login', (req, res) => {
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

app.get('/news/get-profile', authorize, (req, res) => {
    const query = 'SELECT usernames, emails, permission FROM user WHERE id = ?';
    queryDB(res, query, [req.user.id]);
});
app.get('/news/get-all-profiles', authorize, (req, res) => {
    const query = 'SELECT usernames, permission FROM user';
    queryDB(res, query, [req.user.id]);
});


app.put('/news/update-username', authorize, (req, res) => {
    const { username } = req.body;
    const query = 'UPDATE user SET usernames = ? WHERE id = ?';
    queryDB(res, query, [username, req.user.id]);
});

app.put('/news/update-email', authorize, (req, res) => {
    const { email } = req.body;
    const query = 'UPDATE user SET emails = ? WHERE id = ?';
    queryDB(res, query, [email, req.user.id]);
});

app.put('/news/update-password', authorize, (req, res) => {
    const { password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }

        const query = 'UPDATE user SET passwords = ? WHERE id = ?';
        queryDB(res, query, [hashedPassword, req.user.id]);
    });
});

app.delete('/news/delete-account', authorize, (req, res) => {
    const query = 'DELETE FROM user WHERE id = ?';
    queryDB(res, query, [req.user.id]);
});

app.get('/news/check-auth', authorize, (req, res) => {
    res.json({ loggedIn: true, username: req.user.username });
});

app.listen(port, () => console.log(`Server is running at: http://localhost:${port}`));
