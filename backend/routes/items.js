const express = require('express');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All item routes require authentication
router.use(authMiddleware);

// GET /api/items/search?name=xyz  (must be before /:id)
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const items = await Item.find({
      itemName: { $regex: name, $options: 'i' }
    }).populate('postedBy', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/items
router.post('/', async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    const item = await Item.create({
      itemName, description, type, location, date, contactInfo,
      postedBy: req.user.id
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/items/:id
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to update this item' });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.postedBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized to delete this item' });

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
