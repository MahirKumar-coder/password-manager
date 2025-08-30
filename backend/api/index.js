const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const dbName = 'passOp';

let client, db;

// MongoDB connection function with proper error handling
async function connectDB() {
  if (!client) {
    try {
      client = new MongoClient(url, {
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        maxPoolSize: 10,
        minPoolSize: 1
      });
      await client.connect();
      db = client.db(dbName);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
  return db;
}

async function connectDB() {
  if (!db) {
    client = new MongoClient(uri, {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    await client.connect();
    db = client.db('passOp');
  }
  return db;
}

app.get('/debug', (req, res) => {
  res.json({
    MONGODB_URI_exists: Boolean(process.env.MONGODB_URI),
    env: Object.keys(process.env)
  });
});


app.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/', async (req, res) => {
  try {
    const database = await connectDB();
    const data = await database.collection('passwords').find().toArray();
    res.json(data);
  } catch (err) {
    console.error('Runtime Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const database = await connectDB();
    const collection = database.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
  } catch (error) {
    console.error('POST / error:', error);
    res.status(500).json({
      error: 'Database operation failed',
      message: error.message
    });
  }
});

app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const database = await connectDB();
    const collection = database.collection('passwords');
    const findResult = await collection.deleteOne({ id: id });

    if (findResult.deletedCount === 1) {
      res.send({ success: true, message: 'Deleted successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Not found' });
    }
  } catch (error) {
    console.error('DELETE / error:', error);
    res.status(500).json({
      error: 'Database operation failed',
      message: error.message
    });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = serverless(app);
