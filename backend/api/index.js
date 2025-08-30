const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const url = process.env.MONGODB_URI;
const dbName = 'passOp';

let client;
let db;

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

app.get('/debug', (req, res) => {
  res.json({
    MONGODB_URI_exists: Boolean(process.env.MONGODB_URI),
    MONGODB_URI_preview: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.slice(0, 20) + '…'
      : null
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vercel!' });
});

app.get('/', async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (error) {
    console.error('GET / error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message
    });
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
