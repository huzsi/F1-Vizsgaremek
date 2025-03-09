/**Teendők:
 *      scrollmenü elemek méretezése reszponzivitásnál. //Suliban megvan csinálva
 *      Profilkép lehetőség. //suliban
 *      
 *      admin profil esetén oda is egy adminpanel: reportok miatt.
 *      track-html - ha egy futam véget ért akkor a végeredményt lehessen megtekinteni (visszaszámláló helyére).
 * 
 * Megoldani, hogy egy adatsor esetén is belegyenek töltve adatok, ne csak 2 vagy annál több. (Race result, Fórum - commentek, result.html).
 *      adatbázis bővítés - utolsó 5 futamgyőztes. //Suliban megcsinálom
 *      Where can I watch - gomb megcsinálása.
 *      animációk.
 */
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });
const apiKey = 'bd49adc7fe7341ddb75478209aa97049';
const app = express();
const port = process.env.PORT || 3001;
const newsUrl = `https://newsapi.org/v2/everything?q=Formula%201&apiKey=${apiKey}`;
const techUrl = `https://newsapi.org/v2/everything?q=F1 AND Formula 1 AND technical&qInTitle=Analysis&apiKey=${apiKey}`;

const updateCache = async () => {
    const fetch = (await import('node-fetch')).default;
    try {
        const [newsResponse, techResponse] = await Promise.all([
            fetch(newsUrl),
            fetch(techUrl),
        ]);

        const newsData = await newsResponse.json();
        const techData = await techResponse.json();
       

        cache.set('news', newsData);
        cache.set('techNews', techData);
      

        console.log('Cache frissítve');
    } catch (error) {
        console.error('Cache frissítési hiba:', error);
    }
};

updateCache();
setInterval(updateCache, 3600*1000); //Időzítő, hogy mindig frissüljön.

app.use('/static', express.static(path.join(__dirname, 'public'))); //elérési útvonalakhoz.
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
//Lekérdezések könnyítése érdekében:
const queryDB = (res, query, params = []) => {
    conn.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length === 1 ? results[0] : results);
    });
};
//Token tiktosítás miatt, hogy a weboldal elérje a felhasználói lekérdezéseket.
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
//A weboldal által használt aloldalak elérése:
const servePage = (page) => (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', `${page}.html`));
app.get('/', servePage('start'));
app.get('/news/index.html', servePage('index'));
app.get('/news/about.html', servePage('about'));
app.get('/news/auth.html', servePage('auth'));
app.get('/news/tracks.html', servePage('tracks'));
app.get('/news/start.html', servePage('start'));
app.get('/news/profile.html', servePage('profile'));
app.get('/news/raceresult.html', servePage('raceresult'));
app.get('/news/test.html', servePage('test'));
app.get('/news/result-uploader.html', servePage('result-uploader'));
app.get('/news/news', (req, res) => {
    const newsData = cache.get('news');
    if (newsData) {
        res.json(newsData.articles);
    } else {
        res.status(500).json({ error: 'Cache üres' });
    }
});
app.get('/news/tech-news', (req, res) => {
    const techData = cache.get('techNews');
    if (techData) {
        res.json(techData.articles);
    } else {
        res.status(500).json({ error: 'Cache üres' });
    }
});
app.get('/news/news-layout.html/:page', (req, res) => {
    const { page } = req.params;
    let filePath = path.join(__dirname, 'public', 'html', 'news-layout.html');

    if (page === 'tech-news' || page === 'regular-news' || page === 'news') {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});
app.get('/news/forum-layout.html/:page', (req, res) => {
    const { page } = req.params;
    let filePath = path.join(__dirname, 'public', 'html', 'forum-layout.html');

    if(page === 'index' || page === 'topic'){
        res.sendFile(filePath);
    }
    else{
        res.status(404).send('Page not found');
    }
})
//--//
//API végpontok
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
app.get('/news/circuitdatas', (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Missing required parameter: id" });
    queryDB(res, 'SELECT firstGP, lapNumber, length, raceDistance, record, driver, recordYear FROM circuitdatas WHERE id = ?', [req.query.id]);
});
app.get('/news/driverStandlist', (req, res) => {
    queryDB(res, `SELECT driverId,driverName,constructor FROM driverNames`);
});
app.get('/news/constructorStandlist', (req, res) => {
    queryDB(res, `SELECT DISTINCT constructorName, driverNames.constructor FROM constructornames INNER JOIN driverNames ON constructornames.constructorId = driverNames.constructorId`);
});
app.get('/news/seasonRaceResults', (req, res) => {
    queryDB(res, `SELECT * FROM seasonRaceResult`);
});
app.get('/news/raceResults', (req, res) => {
    queryDB(res, `  SELECT
                    rn.raceNumber, 
                    srr.raceId,
                    rn.name AS raceName,
                    d1.driverName AS P1, d2.driverName AS P2, d3.driverName AS P3, d4.driverName AS P4, d5.driverName AS P5,
                    d6.driverName AS P6, d7.driverName AS P7, d8.driverName AS P8, d9.driverName AS P9, d10.driverName AS P10,
                    d11.driverName AS P11, d12.driverName AS P12, d13.driverName AS P13, d14.driverName AS P14, d15.driverName AS P15,
                    d16.driverName AS P16, d17.driverName AS P17, d18.driverName AS P18, d19.driverName AS P19,d20.driverName AS P20
                    FROM seasonRaceResult srr
                    JOIN raceNames rn ON srr.raceId = rn.id
                    LEFT JOIN driverNames d1 ON srr.P1 = d1.driverId
                    LEFT JOIN driverNames d2 ON srr.P2 = d2.driverId
                    LEFT JOIN driverNames d3 ON srr.P3 = d3.driverId
                    LEFT JOIN driverNames d4 ON srr.P4 = d4.driverId
                    LEFT JOIN driverNames d5 ON srr.P5 = d5.driverId
                    LEFT JOIN driverNames d6 ON srr.P6 = d6.driverId
                    LEFT JOIN driverNames d7 ON srr.P7 = d7.driverId
                    LEFT JOIN driverNames d8 ON srr.P8 = d8.driverId
                    LEFT JOIN driverNames d9 ON srr.P9 = d9.driverId
                    LEFT JOIN driverNames d10 ON srr.P10 = d10.driverId
                    LEFT JOIN driverNames d11 ON srr.P11 = d11.driverId
                    LEFT JOIN driverNames d12 ON srr.P12 = d12.driverId
                    LEFT JOIN driverNames d13 ON srr.P13 = d13.driverId
                    LEFT JOIN driverNames d14 ON srr.P14 = d14.driverId
                    LEFT JOIN driverNames d15 ON srr.P15 = d15.driverId
                    LEFT JOIN driverNames d16 ON srr.P16 = d16.driverId
                    LEFT JOIN driverNames d17 ON srr.P17 = d17.driverId
                    LEFT JOIN driverNames d18 ON srr.P18 = d18.driverId
                    LEFT JOIN driverNames d19 ON srr.P19 = d19.driverId
                    LEFT JOIN driverNames d20 ON srr.P20 = d20.driverId
					ORDER BY rn.raceNumber;
                `);
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
///'SELECT * FROM forumTopics'
app.get('/news/forumTopics', (req, res) => {
    queryDB(res, `SELECT tc.topicId, u.usernames, tc.userId, tc.topicTitle, tc.topicContent, tc.date FROM forumTopics tc JOIN user u ON tc.userId = u.id`);
});
app.get('/news/forumTopics/:topicId', (req, res) => {
    const { topicId } = req.params;
    const query = 'SELECT fp.topicId, fp.userId, u.usernames, fp.topicTitle, fp.topicContent, fp.date FROM forumTopics fp JOIN user u ON fp.userId = u.id WHERE topicId = ?';
    queryDB(res, query, [topicId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
});
app.get('/news/forumComments/:topicId', (req, res) => {
    const { topicId } = req.params;

    const query = 'SELECT tc.topicId, tc.commentId, tc.userId, u.usernames, tc.commentContent, tc.date FROM topicComments tc INNER JOIN user u ON tc.userId = u.id WHERE tc.topicId = ?';

    queryDB(res, query, [topicId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Error fetching comments', details: err.message });
        }
        res.json(result);
    });
});
app.get('/news/last-topicComment', (req, res) => {
    const { topicId } = req.query; // Extract topicId from query parameters
    const query = 'SELECT u.usernames, tc.date FROM topicComments tc JOIN user u ON tc.userId = u.id WHERE tc.topicId = ? ORDER BY ABS(TIMESTAMPDIFF(SECOND, tc.date, NOW())) LIMIT 1';

    queryDB(res, query, [topicId], (err, result) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Error fetching comment', details: err.message });
        }
        res.json(result);
    });
});
app.get('/news/popular-topics', (req, res) => {
    queryDB(res, 'SELECT tc.topicId, ft.topicTitle, u.usernames, COUNT(tc.commentId) AS commentCount FROM topicComments tc JOIN user u ON tc.userId = u.id LEFT JOIN forumtopics ft ON tc.topicId = ft.topicId GROUP BY tc.topicId ORDER BY commentCount DESC LIMIT 10;');
});
app.delete('/news/forumTopics/:topicId', (req, res) => {
    const { topicId } = req.params;  // Helyes destrukturálás
    const query = 'DELETE FROM forumTopics WHERE topicId = ?';
    
    queryDB(res, query, [topicId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Topic not found.' });
        }

        res.json({ success: true, message: 'Topic deleted successfully' });
    });
});
// POST a new forum topic
app.post('/news/forumTopics', (req, res) => {
    const { userId, topicTitle, topicContent, date } = req.body;

    const query = `
        INSERT INTO forumTopics (userId, topicTitle, topicContent, date)
        VALUES (?, ?, ?, ?)
    `;
    const values = [
        userId,
        topicTitle,
        topicContent,
        date
    ];
    queryDB(res, query, values);
});
app.post('/news/upload-comment', (req, res) => {
    const { topicId, userId, commentContent, date } = req.body;
    const query = 'INSERT INTO topicComments (topicId, userId, commentContent, date) VALUES (?, ?, ?, ?)';
    const values = [topicId, userId, commentContent, date];

    queryDB(res, query, values, (err, result) => {
        if (err) {
            console.error('Error inserting comment:', err);
            return res.status(500).json({ error: 'Error inserting comment', details: err });
        }
        res.status(201).json({ id: result.insertId, topicId, userId, commentContent, date });
    });
});
app.post('/news/register', (req, res) => {
    const { username, email, password } = req.body;

    const checkQuery = 'SELECT * FROM user WHERE usernames = ? OR emails = ?';
    conn.query(checkQuery, [username, email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking existing users' });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            const insertQuery = 'INSERT INTO user (permission, usernames, emails, passwords) VALUES (3, ?, ?, ?)';
            conn.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user', error: err.message });
                }

                // Automatikus bejelentkezés
                const token = jwt.sign({ id: result.insertId, username }, 'secret_key', { expiresIn: '1h' });
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    username,
                    permission: 3
                });
            });
        });
    });
});
app.post('/news/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE emails = ? OR usernames = ?';
    conn.query(query, [email, email], (err, result) => {
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
            res.json({ token, username: user.usernames, permission: user.permission });
        });
    });
});
app.get('/news/get-profile', authorize, (req, res) => {
    const query = 'SELECT id, usernames, emails, permission FROM user WHERE id = ?';
    queryDB(res, query, [req.user.id]);
});
app.get('/news/get-all-profiles', authorize, (req, res) => {
    const query = 'SELECT id ,usernames, permission FROM user';
    queryDB(res, query, [req.user.id]);
});
app.put('/news/update-permission', authorize, (req, res) => {
    const { permission, id } = req.body;
    const query = 'UPDATE user SET permission = ? WHERE id = ?';
    queryDB(res, query, [permission, id]);
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