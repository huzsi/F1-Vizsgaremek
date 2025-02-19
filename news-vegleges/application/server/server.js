const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

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
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

const servePage = (page) => (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));

app.get('/index.html', servePage('index'));
app.get('/about.html', servePage('about'));
app.get('/auth.html', servePage('auth'));
app.get('/tracks.html', servePage('tracks'));
app.get('/newsCreator.html', servePage('newsCreator'));
app.get('/resultUpload.html', servePage('resultUpload'));
app.get('/start.html', servePage('start'));
app.get('/layout.html/:page', (req, res) => {
    const { page } = req.params;
    let filePath = path.join(__dirname, 'public','html', 'layout.html');

    if (page === 'profile' || page === 'news' || page === 'about' || page === 'news-creator' || page === 'schedule' || page === 'result-uploader') {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
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
app.get('/racenames', (req, res) =>{
    queryDB(res,'SELECT raceNumber, id, name, fullName, trackName FROM racenames ORDER BY raceNumber ASC',[req.query.id]);
});
app.get('/circuitdatas', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT firstGP, lapNumber, length, raceDistance, record, driver, recordYear FROM circuitdatas WHERE id = ?', [req.query.id]);
});

app.get('/driverStandlist', (req, res) => {
    queryDB(res, `SELECT driverId,driverName,constructor FROM standlist`);
});

app.get('/constructorStandlist', (req, res) => {
    queryDB(res, `SELECT DISTINCT constructorName, standlist.constructor FROM constructornames INNER JOIN standlist ON constructornames.constructorId = standlist.constructorId`);
});

app.get('/seasonRaceResults', (req, res) => {
    queryDB(res, `SELECT * FROM seasonRaceResult`);
});

app.post('/saveRaceResults', (req, res) => {
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

app.get('/get-profile', authorize, (req, res) => {
    const query = 'SELECT usernames, emails, passwords FROM user WHERE id = ?';
    queryDB(res, query, [req.user.id]);
});

app.put('/update-username', authorize, (req, res) => {
    const { username } = req.body;
    const query = 'UPDATE user SET usernames = ? WHERE id = ?';
    queryDB(res, query, [username, req.user.id]);
});

app.put('/update-email', authorize, (req, res) => {
    const { email } = req.body;
    const query = 'UPDATE user SET emails = ? WHERE id = ?';
    queryDB(res, query, [email, req.user.id]);
});

app.put('/update-password', authorize, (req, res) => {
    const { password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password', error: err.message });
        }

        const query = 'UPDATE user SET passwords = ? WHERE id = ?';
        queryDB(res, query, [hashedPassword, req.user.id]);
    });
});

app.delete('/delete-account', authorize, (req, res) => {
    const query = 'DELETE FROM user WHERE id = ?';
    queryDB(res, query, [req.user.id]);
});


app.get('/api/content/:page', (req, res) => {
    const page = req.params.page;

    let content = '';

    switch (page) {
        case 'news':
            content = `<section class="news-section"><h3>News Page</h3></section>`;
            break;
        case 'profile':
            content = `<section class="profile-section"><h3>Profile Page</h3></section>`;
            break;
        case 'about':
            content =  `<section class="about-section"><h3>About</h3></section>`;
            break;
        case 'news-creator':
            content =   `<section class="news-creator-section"><h3>Create news</h3></section>`;
            break;
        case 'schedule':
            content = `<section class="schedule-section"><h3>Full Schedule</h3></section>`;
            break;
        case 'schedule':
            content = `<section class="result-uploader-section"><h3>Upload Race result</h3></section>`;
            break;
        default:
            content = ''; // Ne töltsön be semmit, ha nincs paraméter
            break;
    }

    res.json({ content });
});

app.get('/check-auth', authorize, (req, res) => {
    res.json({ loggedIn: true, username: req.user.username });
});

app.listen(port, () => console.log(`Server is running at: http://localhost:${port}`));
