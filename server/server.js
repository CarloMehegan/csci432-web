// server/server.js

 import express from 'express';
 import bodyParser from 'body-parser';
 import bcrypt from 'bcrypt'; 


const app = express();
const port = 3000;

app.use(bodyParser.json());


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

// Signup endpoint
app.post('/signup', async (req, res) => {
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
