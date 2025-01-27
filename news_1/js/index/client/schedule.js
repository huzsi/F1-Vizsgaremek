const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'racecalendar'
});

db.connect(err => {
    if(err){
        console.log('MYSQL connection failed: ', err);
        process.exit();
    }
    console.log('Connected to MYSQL database');
});

