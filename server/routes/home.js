const express = require('express');
const router = express.Router();
const HomeSection = require('../models/HomeSection');
const auth = require('../middleware/auth');

// Get all home sections
router.get('/', async (req, res) => {
  try {
    const sections = await HomeSection.find().sort('order');
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add/Update section
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const { _id, ...data } = req.body;
    let section;
    if (_id) {
      section = await HomeSection.findByIdAndUpdate(_id, data, { new: true });
    } else {
      section = new HomeSection(data);
      await section.save();
    }
    res.json(section);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete section
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    await HomeSection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
