/* =============== 
KONSTRUKTOR STATISZTIKA JAVASCRIPT KÓDJA
=============== */

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'f1-stats'
});

module.exports = pool.promise();

// Lekérdezés a pilóták listájának lekérdezéséhez
const getConstructorList = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT name, nationality, url
      FROM constructors;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a világbajnoki állások lekérdezéséhez
const getConstructorChampionships = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.name AS constructorName, COUNT(*) AS championshipTitles 
      FROM constructorStandings cs
      JOIN constructors c ON cs.constructorId = c.constructorId
      JOIN races r ON cs.raceId = r.raceId
      WHERE cs.position = 1  
      AND r.raceId = (
        SELECT MAX(r2.raceId) 
        FROM races r2 
        WHERE r2.year = r.year
        ) -- Csak az adott szezon utolsó versenyét vizsgáljuk
      GROUP BY c.name
      ORDER BY championshipTitles DESC;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a pole pozíciók számának lekérdezéséhez
const getConstructorPolePositions = () => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT c.name AS constructor_name, COUNT(DISTINCT r.raceId) AS pole_positions
        FROM results res
        JOIN races r ON res.raceId = r.raceId
        JOIN constructors c ON res.constructorId = c.constructorId
        WHERE res.grid = 1
        GROUP BY c.name
        HAVING COUNT(DISTINCT r.raceId) > 0
        ORDER BY pole_positions DESC;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés indítása
const getQueryResults = (queryType, res) => {
  let queryPromise;

  switch (queryType) {
    case 'ConstructorList':
      queryPromise = getConstructorList();
      break;
    case 'constructorChampionships':
      queryPromise = getConstructorChampionships();
      break;
    case 'constructorPolePositions':
      queryPromise = getConstructorPolePositions();
      break;
    default:
      return res.status(400).send('Ismeretlen lekérdezés típus');
  }

  queryPromise
    .then(results => res.json(results)) // Eredmények visszaadása JSON formátumban
    .catch(err => {
      console.error(err);
      res.status(500).send('Hiba történt a lekérdezés során');
    });
};

module.exports = {
  getQueryResults,
};
