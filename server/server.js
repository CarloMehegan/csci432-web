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
    const committees = [];

    const newUser = {
       
      name, 
      email, 
      password: hashedPassword,
      committees: committees
    };

    console.log('New user:', newUser);
    // Insert the new user
    const result = await users.insertOne(newUser);
    console.log('Insertion result:', result); 

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//method to ensure only authenticated users can log in
app.post('/login', async (req, res) => {
  console.log('Login request received');
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try{
    const existingUser = await users.findOne({ email });
    if(!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'User signed in successfully' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

//Post method to create a committee and save the information
app.get('/create-committee', async (req, res) => {
  const {name, emails, roles} = req.body; //how do i make this match forms using arrays

  if(!name || !emails || !roles) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const discussionfile =null; //initialize discussion file
  const motions = []; //initialize motions (might need to change)

  try {
    // Check if the email already exists
    const commiteename = await users.findOne({ name });
    if (commiteename) {
      return res.status(409).json({ message: 'Committee name already in use, please choose a new name' });
    }

    const newCommittee = {
      name,
      emails,
      roles,
      discussionfile,
      motions
    };

    console.log('New committee:', newCommittee);

    const result = await users.insertOne(newCommittee);
    console.log('Insertion result:', result); 

    res.status(201).json({ message: 'Committee successfully created' });
  } catch (error) {
    console.error('Error saving committee:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
