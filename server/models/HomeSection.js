const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  type: { 
    type: String, 
    enum: ['category', 'price', 'badge', 'custom'], 
    required: true 
  },
  value: { type: String, required: true }, // e.g. "Valentine Combos", "500", "Trending"
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('HomeSection', homeSectionSchema);
