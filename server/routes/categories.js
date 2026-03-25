const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('order');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add/Update category
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { _id, ...data } = req.body;
    let category;
    if (_id) {
      category = await Category.findByIdAndUpdate(_id, data, { new: true });
    } else {
      category = new Category(data);
      await category.save();
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete category
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
