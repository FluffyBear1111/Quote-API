const express = require('express');
const app = express();
const { connectToDB, getDB } = require("./db");
const PORT = 8080;

connectToDB().then(() => {
    db = getDB();
})


app.use(express.json());

app.listen(PORT, () => console.log("Listening on http://localhost:8080"))

app.get('/quote/:id', async (req, res) => {
        const { ID } = req.params;
        const quote = await db.collection('Quotes').findOne({id:ID});
    }
)

app.get('/random-quote', (req, res) => {
    const { tags, attribution } = req.query;
    const queryTags = tags ? tags.split(',') : [];
    const queryAttribution = attribution || null;
    const query = {}


})

