/* =============== 
ÁLTALÁNOS STATISZTIKA JAVASCRIPT KÓDJA
=============== */

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'ViCu3972@',
  database: process.env.DB_NAME || 'f1stats'
});

module.exports = pool.promise();

// Egy szezon statisztikáinak lekérdezése (pilóták és konstruktőrök)
const getSeasonStats = (year) => {
  return new Promise((resolve, reject) => {
    const driverQuery = `
      SELECT
          d.forename,
          d.surname,
          SUM(res.points) AS total_points
      FROM 
          results res
      JOIN drivers d ON res.driverId = d.driverId
      JOIN races r ON res.raceId = r.raceId
      WHERE 
          r.year = ?
      GROUP BY 
          d.driverId, d.forename, d.surname
      ORDER BY 
          total_points DESC;
    `;

    const constructorQuery = `
      SELECT
          c.name,
          SUM(res.points) AS total_points
      FROM 
          results res
      JOIN constructors c ON res.constructorId = c.constructorId
      JOIN races r ON res.raceId = r.raceId
      WHERE 
          r.year = ?
      GROUP BY 
          c.constructorId, c.name
      ORDER BY 
          total_points DESC;
    `;

    pool.query(driverQuery, [year], (err, driverResults) => {
      if (err) {
        reject(err);
      } else {
        pool.query(constructorQuery, [year], (err, constructorResults) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              drivers: driverResults,
              constructors: constructorResults,
            });
          }
        });
      }
    });
  });
};

// Versenyek adatainak lekérdezése év szerint
const getRacesByYear = (year) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT raceId, year, round, name as race_name, date, time, circuitId 
      FROM races 
      WHERE year = ? 
      ORDER BY round;
    `;
    pool.query(query, [year], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Versenyek adatainak lekérdezése év szerint
const getRaceResults = (year) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
          d.driverId,
          CONCAT(d.forename, ' ', d.surname) AS driver_name,
          c.name AS constructor_name,
          r.position,
          r.points
      FROM results r
      JOIN drivers d ON r.driverId = d.driverId
      JOIN constructors c ON r.constructorId = c.constructorId
      WHERE r.raceId = ?
      ORDER BY 
          CASE 
              WHEN r.position IS NULL THEN 1 
              ELSE 0 
          END, 
          r.position ASC;
    `;
    pool.query(query, [year], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Lekérdezés indítása
const getQueryResults = (queryType, year, res) => {
  console.log("Kapott queryType:", queryType); // Debug log

  let queryPromise;
  switch (queryType) {
    case 'raceStats':
      queryPromise = getRacesByYear(year);
      break;
    case 'seasonStats':
      queryPromise = getSeasonStats(year);
      break;
    case 'inYearRaceStatistics':
      queryPromise = getRaceResults(year);
      break;
    default:
      console.error("Ismeretlen lekérdezés típus:", queryType);
      return res.status(400).send('Ismeretlen lekérdezés típus');
  }

  queryPromise
    .then(results => res.json(results))
    .catch(err => {
      console.error(err);
      res.status(500).send('Hiba történt a lekérdezés során');
    });
};


module.exports = {
  getQueryResults,
};
