const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Express app inicializálása
const app = express();
app.use(bodyParser.json());

// CORS engedélyezése minden domain számára (fejlesztéshez)
app.use(cors());

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, 'public')));  // A 'public' mappa statikus fájljait szolgáltatjuk ki

// MySQL adatbázis kapcsolat
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Használj saját MySQL felhasználónevet
  password: '',  // Használj saját MySQL jelszót
  database: 'users_db'  // Az adatbázis neve
});

// Kapcsolódás az adatbázishoz
db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    process.exit();
  }
  console.log('Connected to MySQL database');
});

// Regisztrációs végpont
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Jelszó titkosítása
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    // Adatbázisba mentés
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Bejelentkezési végpont
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Ellenőrizzük, hogy létezik-e felhasználó az adatbázisban
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error checking user in the database' });  // JSON válasz
      }
  
      // Ha nem találunk felhasználót
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });  // 404-es hiba, felhasználó nem található
      }
  
      const user = result[0];
  
      // Jelszó ellenőrzése
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });  // JSON válasz
        }
  
        // Ha a jelszó nem egyezik
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });  // 401-es hiba, érvénytelen bejelentkezési adatok
        }
  
        // Token generálása
        const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
  
        // Sikeres válasz JSON formátumban
        res.json({ token });
      });
    });
  });

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
