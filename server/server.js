// server/server.js

const express = require('express');
const cors = require('cors');
const db = require('./database.js');
const mongoose = require('mongoose');

const app = express();
const port = 5173;

app.use(express.json());
app.use(cors()); //enables cross-origin resource sharing



const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://carlomehegan:Y9Yj4IRoeUDx20Nc@cluster0.3wt4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let database = null;
let users = null;
let committees = null;
let motions = null;
async function run() {
  try {
    database = client.db('robert_data');
    users = database.collection('users');
    committees = database.collection('committees');
    motions = database.collection('motions');
    // Query for a movie that has the title 'Back to the Future'
    //const query = { title: 'Back to the Future' };
    //const movie = await movies.findOne(query);
    //console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


//Route to get all committee members
app.get('/committeeMembers', (req, res) => {
    res.json(committeeMembers);
});

// GET endpoint to retrieve committees
app.get('/api/committees', (req, res) => {
    res.json(committees);
});

// GET endpoint to retrieve a specific committee by ID
app.get('/committees/:id', (req, res) => {
    const committeeId = parseInt(req.params.id, 10);
    const committee = committees.find(c => c.id === committeeId);
    if (committee) {
        res.json(committee);
    } else {
        res.status(404).send('Committee not found');
    }
});

// Start the server on port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
