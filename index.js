const express = require('express');
const app = express();
const { connectToDB, getDB } = require("./db");
const PORT = 8080;

connectToDB().then(() => {
    db = getDB();
})

function generateRandomIndex(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
}


app.use(express.json());

app.listen(PORT, () => console.log("Listening on http://localhost:8080"))



app.get('/quote-by-id/:ID', async (req, res) => {
        const { ID } = req.params;
        const quote = await db.collection('Quotes').findOne({id:ID});
        if (!quote) {
            res.status(404).send({message: "Quote not found."})
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
        }
        const randomIndex = generateRandomIndex(quotes.length)
        res.status(200).send(quotes[randomIndex])
    }

    catch (error) {
        res.status(500).send({ message: "Something went wrong on server end."})
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
        if (quotes.length === 0) {
            res.status(404).send({ message: "No quotes found for given tags and/or attribution."})
        }
        const randomIndex = generateRandomIndex(quotes.length);
        res.status(200).send(quotes[randomIndex]);
    }

    catch (error) {
        res.status(500).send("Something went wrong on server end.");
    }
})

