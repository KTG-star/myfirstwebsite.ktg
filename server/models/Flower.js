const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Roses', 'Tulips', 'Sunflowers', 'Lilies', 'Orchids', 'Peonies', 'Bouquets', 'Seasonal', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true // Ensuring image is present as requested
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10
  },
  unitCost: {
    type: Number,
    required: true,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flower', flowerSchema);
