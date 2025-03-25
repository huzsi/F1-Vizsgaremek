// Modulok amiket a weboldal használ
const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // <- Itt direkt beállítjuk az elérési utat

const app = express();
const port = 3001;

// Egyéb modulok (adatbázis lekérdezések stb.)
const pilotStats = require("./pilotStats"); // pilotStats.js
const constructorStats = require("./constructorStats"); // constructorStats.js
const otherStats = require("./otherStats"); // otherStats.js

// Middleware-ek
app.use(cors());
app.use(express.json()); // JSON adatok automatikus feldolgozása
app.use('/static', express.static(path.join(__dirname, "client")));

// Statikus oldalak
app.get("/", function (req, res) {
  // GET esetén a főoldalon az index.html kerül kiszolgálásra
  res.sendFile(path.join(__dirname, "client", "index.html"));
});
app.get("/about.html", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "about.html"));
});

/* =============== 
   PILÓTA STATISZTIKA
   =============== */

app.get("/api/pilotList", (req, res) => {
  pilotStats.getQueryResults("pilotList", res);
});
app.get("/api/raceStarts", (req, res) => {
  pilotStats.getQueryResults("raceStarts", res);
});
app.get("/api/championshipStandings", (req, res) => {
  pilotStats.getQueryResults("championshipStandings", res);
});
app.get("/api/raceWins", (req, res) => {
  pilotStats.getQueryResults("raceWins", res);
});
app.get("/api/podiums", (req, res) => {
  pilotStats.getQueryResults("podiums", res);
});
app.get("/api/polePositions", (req, res) => {
  pilotStats.getQueryResults("polePositions", res);
});
app.get("/api/points", (req, res) => {
  pilotStats.getQueryResults("points", res);
});

/* =============== 
   KONSTRUKTOR STATISZTIKA
   =============== */

app.get("/api/constructorList", (req, res) => {
  constructorStats.getQueryResults("ConstructorList", res);
});
app.get("/api/constructorChampionship", (req, res) => {
  constructorStats.getQueryResults("constructorChampionships", res);
});
app.get("/api/constructorPolePosition", (req, res) => {
  constructorStats.getQueryResults("constructorPolePositions", res);
});

/* =============== 
   EGYÉB STATISZTIKÁK 
   =============== */

// Versenyek neveinek lekérdezése az adott évben
app.get("/races/:year", (req, res) => {
  const year = req.params.year;
  otherStats.getQueryResults("raceStats", year, res);
});
// Egy szezon statisztikáinak lekérdezése
app.get("/api/seasonStats", (req, res) => {
  const year = req.query.year;
  otherStats.getQueryResults("seasonStats", year, res);
});
// Egy verseny statisztikáinak lekérdezése
app.get("/api/raceResults", (req, res) => {
  const raceId = req.query.raceId; // pl.: /api/raceResults?raceId=5
  if (!raceId) {
    return res.status(400).json({ error: "raceId paraméter szükséges" });
  }
  otherStats.getQueryResults("inYearRaceStatistics", raceId, res);
});

/* =============== 
   CHATGPT API VÉGPONT A FŐOLDALON
   =============== */

// Rendszer prompt: A rendszer kizárólag Formula 1 statisztikákra vonatkozó kérdésekre válaszol.
const SYSTEM_PROMPT = "Te egy Formula 1 statisztikákkal foglalkozó asszisztens vagy. Csak a Formula 1-es statisztikák, eredmények, rekordok és tényszerű adatok megosztására koncentrálj. Ha a kérdés nem ebbe a témába tartozik, mondd, hogy csak ebben a témában tudsz segíteni.";

// Főoldalon POST kérés esetén a ChatGPT API-t hívjuk meg
app.post("/", async (req, res) => {
  const { question } = req.body;

  // Ellenőrzés: a kérdés nem üres
  if (!question) {
    return res.status(400).json({ error: "A kérdés hiányzik." });
  }

  // Egyszerű előszűrés: ellenőrizzük, hogy a kérdés tartalmaz-e releváns kulcsszavakat
  if (
    !question.includes("Formula 1") &&
    !question.includes("F1") &&
    !question.toLowerCase().includes("statisztika")
  ) {
    return res.status(400).json({
      error: "Ez a rendszer kizárólag a Formula 1 statisztikákkal kapcsolatos kérdésekre ad választ.",
    });
  }

  // Összeállítjuk a promptot
  const prompt = `${SYSTEM_PROMPT}\n\nKérdés: ${question}\nVálasz:`;

  try {
    // Hívjuk meg az OpenAI ChatCompletion API-t
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question }
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API}`,
        },
      }
    );

    // Kinyerjük a generált választ
    const answer = response.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error("Hiba a válasz generálása során:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Hiba történt a kérdés feldolgozása során." });
  }
});

// Statikus fájlok kiszolgálása (Client mappa)
app.use(express.static("client"));

// Indítsd el a szervert
app.listen(port, () => {
  console.log(`Website is running in: http://localhost:${port}`);
});

module.exports = app;
