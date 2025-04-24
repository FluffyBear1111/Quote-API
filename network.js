const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_CONNECTION_STRING;
const port = process.env.PORT || 3000;
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


const startServer = async () => {
  try 
  {
      await connectToDB();
      const db = getDB();
      app.listen(port, () => console.log(`Listening on Port ${port}`))
  }
  catch (error) 
  {
      console.log('Failed to connect to database: ', error);
      process.exit(1);
  }
}

module.exports = { startServer };
