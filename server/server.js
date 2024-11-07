// server/server.js

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const db = require('./database.js');

const app = express();
const port = 5173;

app.use(express.json());
app.use(cors()); //enables cross-origin resource sharing

let committeeMembers = [];
let users = [];

//Route to get all committee members
app.get('/committeeMembers', (req, res) => {
    res.json(committeeMembers);
});

// GET endpoint to retrieve committees
app.get('/committees', (req, res) => {
    res.json(committees);
});

//Route to sign up a new user, using SQLite
app.post('/signup', (req, res) => {
    const {name, email, password} = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if(err){
            return res.status(500).json({message: 'Database error'});
        }
        if(row){
            return res.status(400).json({message: 'User already exists'});
        }

        db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password], function(err) {
            if(err){
                return res.status(500).json({message: 'Database error'});
            }
            res.status(201).json({message: 'User created successfully'});
        });
    });
});


//Route to add a new committee member
app.post('/committee', (req, res) => {
    const newMember = req.body;
    committeeMembers.push(newMember);
    res.json(newMember);
});

// Start the server on port 5173
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
