const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(uri);
let _db;


async function connectToDB() {
  try 
  {
    await client.connect();
    _db = client.db("QuoteDB"); 
    console.log("Connected to MongoDB Atlas");
  } 
  catch (error) 
  {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!_db) {
    throw new Error("DB not initialized! Call connectToDB() first.");
  }
  return _db;
}


module.exports = { connectToDB, getDB };
