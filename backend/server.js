const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')

dotenv.config();

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'passOp';
const app = express(); // Ek baar hi define karna hai
const port = 3000;
app.use(bodyParser.json())
app.use(cors())

async function startServer() {
  await client.connect();

  app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  });

  app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({ success: true, result: findResult });
  });

  app.delete('/', async (req, res) => {
    const { id } = req.body;  // sirf id chahiye
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const findResult = await collection.deleteOne({ id: id });  // id ke basis par delete

    if (findResult.deletedCount === 1) {
      res.send({ success: true, message: 'Deleted successfully' });
    } else {
      res.status(404).send({ success: false, message: 'Not found' });
    }
  });


  app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
  });
}

startServer().catch(console.error);