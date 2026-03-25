const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Add product
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Update product
router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Admin: Delete product
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Toggle active status
router.patch('/:id/toggle', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const product = await Product.findById(req.params.id);
    product.active = !product.active;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Admin: Import products from CSV
router.post('/import', auth, upload.single('file'), async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const productsToInsert = results.map(row => {
          // Mapping WordPress/WooCommerce typical columns
          // Adjust common variants: "Name" vs "Title", "Regular price" vs "Price"
          const name = row.Name || row.Title || '';
          const regularPrice = parseFloat(row['Regular price'] || row.Price || 0);
          const salePrice = parseFloat(row['Sale price'] || 0);
          const images = (row.Images || '').split(',').map(img => img.trim()).filter(Boolean);
          const categories = (row.Categories || row.Category || 'Uncategorized').split('>').pop().trim();

          return {
            name,
            price: salePrice || regularPrice,
            originalPrice: salePrice ? regularPrice : 0,
            image: images[0] || 'https://via.placeholder.com/300',
            images: images.slice(1),
            category: categories,
            description: row.Description || row['Short description'] || '',
            active: true
          };
        }).filter(p => p.name);

        if (productsToInsert.length > 0) {
          await Product.insertMany(productsToInsert);
        }

        // Cleanup
        fs.unlinkSync(req.file.path);
        res.json({ message: `Successfully imported ${productsToInsert.length} products` });
      } catch (err) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: err.message });
      }
    });
});

module.exports = router;
