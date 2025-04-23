const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(uri);
let db;


async function connectToDB() {
  try {
    await client.connect();
    db = client.db("QuoteDB"); 
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("DB not initialized! Call connectToDB() first.");
  }
  return db;
}

module.exports = { connectToDB, getDB };
