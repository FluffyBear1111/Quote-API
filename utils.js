const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        message: "Too many requests, try again later."
    },
    validate: { xForwardedForHeader: false },
})

const generateRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

const parseQueryTags = (tags) => {
    if (!tags || tags === '') return null;
    return tags.split('+')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
};

const parseAttribution = (attribution) => {
    if (!attribution || attribution.trim() === '') {
        return null;
    }
    return attribution.trim();
}

module.exports = { limiter, generateRandomIndex, parseQueryTags, parseAttribution };

/* const startServer = async () => {
    try 
    {
        await connectToDB();
        db = getDB();
        const port = process.env.PORT || 8080;
        app.listen(port, () => console.log(`Listening on Port ${port}`))
    }
    catch (error) 
    {
        console.error('Failed to start: ', error);
        process.exit(1);
    }
  }

startServer();  */