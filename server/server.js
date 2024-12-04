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
let current = null;
async function run() {
  try {
    database = client.db('robert_data');
    users = database.collection('users');
    committees = database.collection('committees');
    motions = database.collection('motions');
    current = database.collection('current');
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
      console.log("hello")
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Updating currentUserName...');
    const result = await current.updateOne(
      { id: 1 },
      { $set: { currentUserName: email } },
      { upsert: true }
    );

    console.log('currentUserName updated:', email);

    res.status(200).json({ message: 'User signed in successfully' });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

//Post method to create a committee and save the information

app.post('/create-committee', async (req, res) => {
  console.log('Create committee request received');
  const {name, emails, roles} = req.body; //how do i make this match forms using arrays

  if(!name || !emails || !roles) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const currentmotion = [];

  try {
    // Check if the email already exists
    const commiteename = await committees.findOne({ name });
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

    const result = await committees.insertOne(newCommittee);
    console.log('Insertion result:', result); 

      // Add the committee name to each user's `committees` array
      const userUpdateResults = await Promise.all(
        emails.map(email =>
          users.updateOne(
            { email },
            { $addToSet: { committees: name } }, // Add the committee name if it doesn't already exist in the array
            { upsert: false } // Do not create a new user if the email doesn't exist
          )
        )
      );
  
      console.log('User update results:', userUpdateResults)

    res.status(201).json({ message: 'Committee successfully created' });
  } catch (error) {
    console.error('Error saving committee:', error);
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

 //get user by email
app.get('/userEmail/:email', async (req, res) => {
  const userEmail = req.params.email; 
  
  try {
    const user = await users.findOne({ email: userEmail });
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
    const motion = await motions.findOne({ name: motionName });
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
  console.log('Get motions request received');
  const committeeName = req.params.committee;
  console.log('Committee name:', committeeName);  
  
  try {
    const motionsList = await motions.find({ committeeName }).toArray();
    if (motionsList.length > 0) {
      res.status(200).json(motionsList);
    } else {
      res.status(404).send('Motions not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving motions');
  }
});

 //update current user using email
 app.post('/updateCurrentUser', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Name is required');
  }

  try {
    const result = await current.updateOne(
      {},
      { $set: { currentUserName: name } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Current user name updated successfully', result });
  } catch (error) {
    res.status(500).send('Error updating current user name');
  }
});

//update current committee
// Update current committee
app.post('/updateCurrentCommittee', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Name is required');
  }

  try {
    const result = await current.updateOne(
      { id: 1 }, // Ensure this matches the document's id field
      { $set: { currentCommitteeName: name } },
      { upsert: true }
    );


    res.status(200).json({ message: 'Current committee name updated successfully', result });
  } catch (error) {
    console.error('Error updating current committee name:', error);
    res.status(500).send('Error updating current committee name');
  }
});

//update current motion
app.post('/updateCurrentMotion', async (req, res) => {
  console.log('Update current motion request received');

  const committee = current.currentCommitteeName
  // Fetch motions by committee
  const response = await fetch (`http://localhost:3000/motions/${committee}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

console.log(response);
  // Check if motions were returned
if (!response.ok) {
return res.status(404).send('No motions found for the given committee');
}

const motions = await response.json(); // Parse the JSON response

  if (!motions || motions.length === 0) {
    return res.status(404).send('No motions found for the given committee');
  }

  // Use the first motion as the current motion
  const firstMotionName = motions[0].name;

  // Update current motion in both collections
  await current.updateOne(
    {},
    { $set: { currentMotionName: firstMotionName } },
    { upsert: true }
  );

  await current.currentCommittee.updateOne(
    {},
    { $set: { currentmotionName: firstMotionName } },
    { upsert: true }
  );
  res.status(200).json({
    message: 'Current committee and motion updated successfully',
    result,
    currentMotionName: firstMotionName,
  });
  });



 //get current info
 app.get('/current', async (req, res) => {
  const current1 = 1;
  try {
    const currentInfo = await current.findOne({ id: current1 });
    if (currentInfo) {
      res.status(200).json(currentInfo);
    } else {
      res.status(404).send('Current not found');
    }
  } catch (error) {
    res.status(500).send('Error retrieving current');
  }
 });

 // Add a new motion
app.post('/addMotion', async (req, res) => {
  const { name, description } = req.body;
  const current1 = 1;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  const users =[];
  const messages = [];

  try {
    const currentInfo = await current.findOne({ id: current1 });
    const newMotion = {
      name,
      description,
      for: 0,
      against: 0,
      status: 'active',
      decision: 'pending',
      committeeName: currentInfo.currentCommitteeName,
      users: [],
      messages: []
    };

    const result = await motions.insertOne(newMotion);

    res.status(201).json({ message: 'Motion added successfully', result });
  } catch (error) {
    console.error('Error adding motion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get the current user email
app.get('/current-user-email', async (req, res) => {
  try {
    const currentInfo = await current.findOne({ id: 1 });
    console.log(currentInfo);
    if (currentInfo && currentInfo.currentUserName) {
      res.status(200).json({ email: currentInfo.currentUserName });
    } else {
      res.status(404).json({ message: 'Current user not found' });
    }
  } catch (error) {
    console.error('Error retrieving current user email:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  });

//Post method to push messages for motion discussion to array
app.post('/addMessage', async (req, res) => {
  const { message } = req.body;
  const current1 = 1;
  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const currentInfo = await current.findOne({ id: current1 });
    
    const committee = await committees.findOne({ name: currentInfo.currentCommitteeName });
        if (!committee) {
            return res.status(404).json({ message: 'Committee not found' });
        }
    
    
    const motion = await motions.findOne({ name: committee.currentmotionName });
    console.log('Current Motion:', motion);

    //ensure motion exists
    if (!motion) {
      return res.status(404).json({ message: 'Motion not found' });
    }

       // Update the messages array and ensure it exists
       const updatedMessages = Array.isArray(motion.messages) ? [...motion.messages, message] : [message];
       const updatedUsers = Array.isArray(motion.users)
         ? [...motion.users, currentInfo.currentUserName]
         : [currentInfo.currentUserName]; // Use a Set to ensure uniqueness
   
       // Update the motion in the database
       const result = await motions.updateOne(
         { name: committee.currentmotionName }, // Find motion by its name
         {
           $set: {
             messages: updatedMessages,
             users: updatedUsers,
           },
         }
       );
   
       if (result.nModified === 0) {
         return res.status(500).json({ message: 'Failed to update the motion' });
       }
   
       console.log('Updated motion messages:', updatedMessages);
       console.log('Updated motion users:', updatedUsers);
    
       res.status(201).json({ message: 'Message added successfully', result });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get method to retrieve the motion messages
app.get('/getMessages', async (req, res) => {
  console.log('Get messages request received');
  
  try {
    const currentInfo = await current.findOne({ id: 1 });
    console.log('Current info:', currentInfo);
    if (!currentInfo) {
      return res.status(404).json({ message: 'No current committee selected' });
    }

    const committee = await committees.findOne({ name: currentInfo.currentCommitteeName });
    if(!committee) {
      return res.status(404).json({ message: 'Committee not found' });
    }

    const motion = await motions.findOne({ name: committee.currentmotionName });
    console.log('Current motion:', motion);
    if (!motion) {
      return res.status(404).json({ message: 'No current motion selected' });
    }


    console.log('Messages:',motion.messages);

    res.status(200).json({ messages:motion.messages, users:motion.users });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


    // Close a motion and update the next motion in queue
  app.post('/close-motion', async (req, res) => {
  const { decision, description } = req.body;

  if (!decision || !description) {
    return res.status(400).json({ message: 'Decision and description are required' });
  }

  try {
    // Get the current committee info
    const currentInfo = await current.findOne({ id: 1 });

    if (!currentInfo || !currentInfo.currentCommitteeName) {
      return res.status(404).json({ message: 'No current committee selected' });
    }

    const currentCommittee = await committees.findOne({
      name: currentInfo.currentCommitteeName,
    });

    if (!currentCommittee) {
      return res.status(404).json({ message: 'Committee not found' });
    }

    const currentMotionName = currentCommittee.currentmotionName;

    if (!currentMotionName) {
      return res.status(400).json({ message: 'No active motion to close' });
    }

    // Update the current motion's status and decision
    await motions.updateOne(
      { name: currentMotionName, committeeName: currentInfo.currentCommitteeName },
      { $set: { status: 'Closed', decision, description } }
    );

    // Get the next motion in the queue
    const nextMotion = currentCommittee.motions.shift();

    if (!nextMotion) {
      return res.status(404).json({ message: "No more motions in the queue" });
    }

    // Update the committee's currentMotion and motion queue
    await committees.updateOne(
      { name: currentInfo.currentCommitteeName },
      {
        $set: { currentMotion: nextMotion || null },
        $pull: { motions: currentMotionName }, // Remove the closed motion from the queue
      }
    );

    res.status(200).json({
      message: 'Motion closed successfully',
      nextMotion: nextMotion || 'No more motions in the queue',
    });
  } catch (error) {
    console.error('Error closing motion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get method to retrieve the motion messages
app.get('/getMessages',(req,res) =>{
  res.json({ messages });
});

// Get the current motion of a committee
app.get('/current-motion', async (req, res) => {
  try {
    const currentInfo = await current.findOne({ id: 1 });

    if (!currentInfo || !currentInfo.currentCommitteeName) {
      return res.status(404).json({ message: 'No current committee selected' });
    }

    const committee = await committees.findOne({
      name: currentInfo.currentCommitteeName,
    });

    if (!committee) {
      return res.status(404).json({ message: 'Committee not found' });
    }

    res.status(200).json({ currentMotion: committee.currentMotion });
  } catch (error) {
    console.error('Error retrieving current motion:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Start the server on port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
