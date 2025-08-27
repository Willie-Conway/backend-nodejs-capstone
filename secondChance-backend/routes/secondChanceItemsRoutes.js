const express = require('express');
const multer = require('multer');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, directoryPath),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// ======================
// GET ALL ITEMS
// ======================
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const secondChanceItems = await collection.find({}).toArray();
    res.json(secondChanceItems);
  } catch (e) {
    logger.error('Something went wrong', e);
    next(e);
  }
});

// ======================
// GET ITEM BY ID
// ======================
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id });

    if (!secondChanceItem) {
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    res.json(secondChanceItem);
  } catch (e) {
    next(e);
  }
});

// ======================
// ADD NEW ITEM
// ======================
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const lastItemQuery = await collection.find().sort({ id: -1 }).limit(1);

    let secondChanceItem = req.body;

    await lastItemQuery.forEach(item => {
      secondChanceItem.id = (parseInt(item.id) + 1).toString();
    });

    // Keep camelcase rule compliant (disable ESLint locally for DB field)
    // eslint-disable-next-line camelcase
    secondChanceItem.date_added = Math.floor(Date.now() / 1000);

    await collection.insertOne(secondChanceItem);
    res.status(201).json(secondChanceItem);
  } catch (e) {
    next(e);
  }
});

// ======================
// UPDATE EXISTING ITEM
// ======================
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id });

    if (!secondChanceItem) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    secondChanceItem.category = req.body.category;
    secondChanceItem.condition = req.body.condition;
    secondChanceItem.age_days = req.body.age_days;
    secondChanceItem.description = req.body.description;
    secondChanceItem.age_years = Number((secondChanceItem.age_days / 365).toFixed(1));
    secondChanceItem.updatedAt = new Date();

    await collection.findOneAndUpdate(
      { id },
      { $set: secondChanceItem },
      { returnDocument: 'after' }
    );

    res.json({ uploaded: 'success' });
  } catch (e) {
    next(e);
  }
});

// ======================
// DELETE ITEM
// ======================
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const id = req.params.id;
    const secondChanceItem = await collection.findOne({ id });

    if (!secondChanceItem) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    await collection.deleteOne({ id });
    res.json({ deleted: 'success' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
