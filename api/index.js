require('dotenv').config();

const { limiter, generateRandomIndex, parseQueryTags, parseAttribution } = require('../utils');
const { connectToDB, getDB } = require("../database-connection");
const express = require('express');
const app = express();
let db;



// Middleware
app.use(limiter);
app.use(express.json());
app.use(async (req, res, next) => {
    if (!db) {
        try {
            await connectToDB();
            db = getDB();
        } 
        catch (error) {
            return res.status(500).send({ message: "Database connection failed" });
        }
    }
    next();
});

// Endpoints 
app.get('/quote-by-id/:ID', async (req, res) => {
    try 
    {
        const { ID } = req.params;
        if (!ID) { 
            return res.status(400).send({ message: "ID parameter is required."});
        }
    
        const quote = await db.collection('Quotes').findOne({id:ID});
    
        if (!quote) {
            res.status(404).send({ message: "Quote not found." })
            return;
        }
        else res.status(200).send(quote);          
    } 
    catch (error) {
        return res.status(500).send({ message: "Something went wrong on server end.", error: error.message })
    }
})

app.get('/quote', async (req, res) => {
    const { tags, attribution } = req.query;
    const queryTags = parseQueryTags(tags);
    const queryAttribution = parseAttribution(attribution);
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
    const queryTags = parseQueryTags(tags);
    const queryAttribution = parseAttribution(attribution);
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
            res.status(404).send({ message: "No quotes found for given tags and/or attribution." })
            return;
        }
        const randomIndex = generateRandomIndex(quotes.length);
        res.status(200).send(quotes[randomIndex]);
    }

    catch (error) {
        res.status(500).send({ message: "Something went wrong on server end." , error : error.message});
    }
})

module.exports = app;
