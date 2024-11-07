// server/server.js
import express, {json} from 'express';
import cors from 'cors';
import { committees } from './data.js';

const app = express();
const port = 5173;

app.use(json());
app.use(cors());

// GET endpoint to retrieve committees
app.get('/committees', (req, res) => {
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

// Start the server on port 5173
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
