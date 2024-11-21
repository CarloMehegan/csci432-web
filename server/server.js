// server/server.js

import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'; 

import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', // Ensure your client URL is correct
  methods: 'GET,POST',             // Ensure POST method is allowed
  allowedHeaders: 'Content-Type' }));


import { MongoClient } from "mongodb";
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
    console.log('Connected to MongoDB');
    // Query for a movie that has the title 'Back to the Future'
    //const query = { title: 'Back to the Future' };
    //const movie = await movies.findOne(query);
    //console.log(movie);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
run().catch(console.dir);

// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request received');
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    await users.insertOne({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get committee by name
app.get('/team/:name', async (req, res) => {
  const teamName = req.params.name;
  try {
    const team = await committees.findOne({ name: teamName });
    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).send('Team not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving team');
  }
 });

 //get user by name
 app.get('/user/:name', async (req, res) => {
  const userName = req.params.name;
  try {
    const user = await users.findOne({ name: userName });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving user');
  }
 });

 //get motion by name
 app.get('/motion/:name', async (req, res) => {
  const motionName = req.params.name;
  try {
    const motion = await users.findOne({ name: motionName });
    if (motion) {
      res.status(200).json(motion);
    } else {
      res.status(404).send('Motion not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving motion');
  }
 });

 //get all motions by committee
 app.get('/motions/:committee', async (req, res) => {
  const committeeName2 = req.params.name;
  try {
    const motions = await motions.findAll({ committeeName: committeeName2 });
    if (motions) {
      res.status(200).json(motions);
    } else {
      res.status(404).send('Motions not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving motions');
  }
 });

//Route to get all committee members
// app.get('/committeeMembers', (req, res) => {
//     res.json(committeeMembers);
// });

// // GET endpoint to retrieve committees
// app.get('/api/committees', (req, res) => {
//     res.json(committees);
// });

// // GET endpoint to retrieve a specific committee by ID
// app.get('/committees/:id', (req, res) => {
//     const committeeId = parseInt(req.params.id, 10);
//     const committee = committees.find(c => c.id === committeeId);
//     if (committee) {
//         res.json(committee);
//     } else {
//         res.status(404).send('Committee not found');
//     }
// });

//Start the server on port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
