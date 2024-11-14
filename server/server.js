// server/server.js

import express, { json } from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(json());
app.use(cors());


app.use(express.json());
app.use(cors()); //enables cross-origin resource sharing

let committeeMembers = [];
let users = [];

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
