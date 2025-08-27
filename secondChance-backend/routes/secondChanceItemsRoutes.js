// secondChanceItemsRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path'); // eslint-disable-line no-unused-vars
const fs = require('fs'); // eslint-disable-line no-unused-vars
const connectToDatabase = require('../models/db');
const logger = require('../logger');

const router = express.Router();

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, directoryPath);
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const secondChanceItems = await collection.find({}).toArray();
    res.json(secondChanceItems);
  } catch (error) {
    logger.error('Something went wrong', error);
    next(error);
  }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;
    const secondChanceItem = await collection.findOne({ id });

    if (!secondChanceItem) {
      return res.status(404).send('secondChanceItem not found');
    }

    res.json(secondChanceItem);
  } catch (error) {
    next(error);
  }
});

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const lastItemQuery = await collection.find().sort({ id: -1 }).limit(1);
    const newItem = req.body;

    await lastItemQuery.forEach((item) => {
      newItem.id = (parseInt(item.id, 10) + 1).toString();
    });

    newItem.dateAdded = Math.floor(Date.now() / 1000);
    const result = await collection.insertOne(newItem);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Update an existing item
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;
    const item = await collection.findOne({ id });

    if (!item) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    const updatedItem = {
      ...item,
      category: req.body.category,
      condition: req.body.condition,
      ageDays: req.body.age_days,
      description: req.body.description,
      ageYears: Number((req.body.age_days / 365).toFixed(1)),
      updatedAt: new Date()
    };

    const updateResult = await collection.findOneAndUpdate(
      { id },
      { $set: updatedItem },
      { returnDocument: 'after' }
    );

    res.json({ uploaded: updateResult ? 'success' : 'failed' });
  } catch (error) {
    next(error);
  }
});

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;
    const item = await collection.findOne({ id });

    if (!item) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    await collection.deleteOne({ id });
    res.json({ deleted: 'success' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
