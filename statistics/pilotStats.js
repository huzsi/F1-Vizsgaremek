/* =============== 
PILÓTA STATISZTIKA JAVASCRIPT KÓDJA
=============== */

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'f1stats'
});

module.exports = pool.promise();

// Lekérdezés a pilóták listájának lekérdezéséhez
const getPilotList = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT drivers.code as Code, drivers.forename as FirstName, drivers.surname as LastName, 
             DATE(drivers.dob) as DateOfBirth, drivers.nationality as Nationality, drivers.url as Wiki
      FROM drivers 
      WHERE 1; 
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a versenyek számának lekérdezéséhez
const getRaceStarts = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT drivers.forename AS FirstName, drivers.surname AS LastName, COUNT(results.driverId) AS RaceCount
      FROM drivers
      LEFT JOIN results ON drivers.driverId = results.driverId
      GROUP BY drivers.driverId, drivers.forename, drivers.surname
      ORDER BY RaceCount DESC;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a világbajnoki állások lekérdezéséhez
const getChampionshipStandings = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT drivers.forename AS FirstName, drivers.surname AS LastName, COUNT(*) AS WorldChampionships 
      FROM drivers 
      JOIN driverstandings ON drivers.driverId = driverstandings.driverId 
      JOIN races ON driverstandings.raceId = races.raceId 
      WHERE driverstandings.position = 1
      AND races.round = (SELECT MAX(r2.round) FROM races r2 WHERE r2.year = races.year) 
      GROUP BY drivers.driverId, drivers.forename, drivers.surname 
      ORDER BY WorldChampionships DESC; 
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a verseny győzelmek számának lekérdezéséhez
const getRaceWins = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.forename, p.surname, COUNT(*) AS wins
      FROM drivers p
      JOIN results res ON p.driverId = res.driverId
      JOIN races r ON res.raceId = r.raceId
      AND res.positionOrder = 1
      GROUP BY p.driverId
      ORDER BY wins DESC, p.surname, p.forename;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a dobogós helyezések számának lekérdezéséhez
const getPodiums = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT drivers.forename AS FirstName, drivers.surname AS LastName,
              COUNT(CASE WHEN results.positionOrder = 1 THEN 1 END) AS FirstPlaceCount,
              COUNT(CASE WHEN results.positionOrder = 2 THEN 1 END) AS SecondPlaceCount,
              COUNT(CASE WHEN results.positionOrder = 3 THEN 1 END) AS ThirdPlaceCount,
              SUM(CASE WHEN results.positionOrder IN (1, 2, 3) THEN 1 ELSE 0 END) AS TotalPodiums
      FROM drivers
      JOIN results ON drivers.driverId = results.driverId
      WHERE results.positionOrder IN (1, 2, 3)
      GROUP BY drivers.driverId, drivers.forename, drivers.surname
      ORDER BY TotalPodiums DESC, FirstPlaceCount DESC, SecondPlaceCount DESC, ThirdPlaceCount DESC;
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a pole pozíciók számának lekérdezéséhez
const getPolePositions = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT CONCAT(d.forename, ' ', d.surname) AS fullName, COUNT(r.resultId) AS polePositionCount 
      FROM drivers d 
      JOIN results r ON d.driverId = r.driverId 
      WHERE r.grid = 1 
      GROUP BY fullName 
      ORDER BY polePositionCount DESC 
    `;
    pool.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés a pontok számának lekérdezéséhez
const getPoints = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT drivers.forename AS FirstName, drivers.surname AS LastName, SUM(results.points) AS TotalPoints
        FROM drivers
        JOIN results ON drivers.driverId = results.driverId
        GROUP BY drivers.driverId, drivers.forename, drivers.surname
        ORDER BY TotalPoints DESC;
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
    case 'pilotList':
      queryPromise = getPilotList();
      break;
    case 'raceStarts':
      queryPromise = getRaceStarts();
      break;
    case 'championshipStandings':
      queryPromise = getChampionshipStandings();
      break;
    case 'raceWins':
      queryPromise = getRaceWins();
      break;
    case 'podiums':
      queryPromise = getPodiums();
      break;
    case 'polePositions':
      queryPromise = getPolePositions();
      break;
    case 'points':
      queryPromise = getPoints();
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
