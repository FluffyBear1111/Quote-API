const { connectToDB, getDB } = require("./db");
const rateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const PORT = 8080;
let db;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        message: "Too many requests, try again later."
    }
})

function generateRandomIndex(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
}

connectToDB()
    .then(() => {
        db = getDB();
        app.listen(PORT, () => console.log("Listening on http://localhost:8080"));
    })
    .catch(error => {
        console.error('Failed to connect to database: ', error);
        process.exit(1)
    })



app.use(limiter);
app.use(express.json());


app.get('/quote-by-id/:ID', async (req, res) => {
        const { ID } = req.params;
        const quote = await db.collection('Quotes').findOne({id:ID});
        if (!quote) {
            res.status(404).send({ message: "Quote not found." })
            return;
        }
        else {
            res.status(200).send(quote);          
        }
})

app.get('/quote', async (req, res) => {
    const { tags, attribution } = req.query;
    const queryTags = tags && tags !== '' ? tags.split('+').filter(tag => tag.trim() !== '') : null;
    const queryAttribution = attribution || null;
    const query = {}

    if (queryTags) {
        query.tags = { $in: queryTags};
    }
    if (queryAttribution) {
        query.attribution = { $regex: queryAttribution, $options: 'i' };
    }

    try {
        const quotes = await db.collection('Quotes').find(query).toArray();
        if (quotes.length === 0) {
            res.status(404).send({ message: "No quotes found for given tags and/or attribution."})
            return;
        }
        const randomIndex = generateRandomIndex(quotes.length)
        res.status(200).send(quotes[randomIndex])
    }

    catch (error) {
        res.status(500).send({ message: "Something went wrong on server end.", error: error.message })
    }
})

app.get('/quote-devChoice', async (req, res) => {
    const { tags, attribution } = req.query;
    const queryTags = tags && tags !== '' ? tags.split('+').filter(tag => tag.trim() !== '') : null;
    const queryAttribution = attribution !== '' ? attribution : null;
    const query = {};
    query.devChoice = true;

    if (queryAttribution) {
        query.attribution = { $regex: queryAttribution, $options: 'i'};
    }

    if (queryTags) {
        query.tags = { $in: queryTags};
    }

    try {
        const quotes = await db.collection('Quotes').find(query).toArray();
        if (quotes.length === 0) 
        {
            res.status(404).send({ message: "No quotes found for given tags and/or attribution.", error: error.message })
            return;
        }
        const randomIndex = generateRandomIndex(quotes.length);
        res.status(200).send(quotes[randomIndex]);
    }

    catch (error) {
        res.status(500).send("Something went wrong on server end.");
    }
})

