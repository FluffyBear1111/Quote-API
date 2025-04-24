const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        message: "Too many requests, try again later."
    }
})

const generateRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

const parseQueryTags = (tags) => {
    if (!tags || tags === '') return null;
    return tags.split('+')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
};

const parseAttribution = (attribution) => {
    if (attribution !== '') {
        return attribution;
    }
    else return null;
}

module.exports = { limiter, generateRandomIndex, parseQueryTags, parseAttribution };

                