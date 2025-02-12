const express = require(`express`);
const mysql = require(`mysql2`);
const cors = require(`cors`);
const path = require('path');

const app = express();
const port = process.env.port || 3000; 

app.use('/static', express.static(path.join(__dirname, 'frontend'))); 

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'racecalendar'
});
conn.connect(err => {
    if (err) {
      throw err;
    }
    console.log('MySQL connected...');
  });

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'index.html'));
});
app.get('/about.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'about.html'));
});
app.get('/auth.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'auth.html'));
});
app.get('/tracks.html', function(req, res){
    res.sendFile(path.join(__dirname, 'frontend','html','tracks.html'));
})
app.get('/news.html', function(req, res){
    res.sendFile(path.join(__dirname, 'frontend', 'html', 'news.html'));
})
app.get('/racenames', (req, res) => {
    const query = 'SELECT raceNumber, id, name, fullName, trackName FROM racenames ORDER BY raceNumber ASC';
    conn.query(query, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
});

app.get('/race-schedule', (req, res) => {
    const query = `
          SELECT rd.id, rd.type, rd.event1, rd.event2, rd.event3, rd.event4, rd.event5, rn.name, rn.fullName, rn.trackName, rn.raceNumber 
          FROM racedates rd 
          JOIN racenames rn ON rd.id = rn.id 
          ORDER BY rn.raceNumber ASC
    `;
  
    conn.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
  });
  
app.get('/trackinfo', (req, res) => {
  const raceId = req.query.id;
  
  const query = 'SELECT trackName, fullName FROM racenames WHERE id = ?';
  conn.query(query, [raceId], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(results[0]);
  });
});
app.get('/circuitdatas', (req, res) => {
  const raceId = req.query.id;
  const query = 'SELECT firstGP, lapNumber, length, raceDistance, record, driver, recordYear FROM circuitdatas WHERE id = ?';
  conn.query(query, [raceId], (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.json(results[0]);
  });
});


app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}`);
});