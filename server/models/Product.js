const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }],
  videoUrl: { type: String },
  category: { type: String, required: true },
  badge: { type: String },
  description: { type: String },
  shippingOverride: { type: Boolean, default: false },
  customFields: [{
    type: { type: String, enum: ['text', 'date', 'image'] },
    label: String,
    required: Boolean,
    maxPhotos: Number
  }],
  variants: [{
    label: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  allowImageUpload: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
