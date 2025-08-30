const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'passOp';

const app = express();
app.use(bodyParser.json());
app.use(cors());

let db;
client.connect().then(() => {
  db = client.db(dbName);
});

app.get('/', async (req, res) => {
  try {
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne({ id: id });
    if (findResult.deletedCount === 1) {
      res.send({ success: true, message: 'Deleted successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = serverless(app);
