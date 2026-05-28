require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Flower = require('./models/Flower');
const User = require('./models/User');

const flowers = [
  // ===== ROSES (15) =====
  {
    name: 'Red Velvet Roses',
    category: 'Roses',
    description: 'Classic deep red roses perfect for expressing love and passion.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    photoIds: ["1518709268805-4e9042af9f23"],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Pink Garden Roses',
    category: 'Roses',
    description: 'Soft pink garden roses with a delicate fragrance, perfect for any occasion.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&auto=format&fit=crop',
    photoIds: ["1496062031456-07b8f162a322"],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'White Rose Elegance',
    category: 'Roses',
    description: 'Pure white roses symbolizing innocence and new beginnings.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&auto=format&fit=crop',
    photoIds: ["1559563362-c667ba5f5480"],
    stockQuantity: 18, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Yellow Sunshine Roses',
    category: 'Roses',
    description: 'Bright yellow roses representing friendship, joy and warmth.',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&auto=format&fit=crop',
    photoIds: ["1548094990-c16ca90f1f0d"],
    stockQuantity: 22, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Coral Blush Roses',
    category: 'Roses',
    description: 'Gorgeous coral-toned roses with a warm romantic glow.',
    price: 15500,
    image: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=600&auto=format&fit=crop',
    photoIds: ["1465189684280-6a8fa9b19a7a"],
    stockQuantity: 15, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Deep Purple Roses',
    category: 'Roses',
    description: 'Rare and enchanting deep purple roses for a truly unique gift.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Orange Flame Roses',
    category: 'Roses',
    description: 'Vibrant orange roses full of energy and enthusiasm.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&auto=format&fit=crop',
    photoIds: ["1582794543139-8ac9cb0f7b11"],
    stockQuantity: 17, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Cream Rose Bouquet',
    category: 'Roses',
    description: 'Elegant cream roses, a timeless classic for weddings and celebrations.',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&auto=format&fit=crop',
    photoIds: ["1471086569966-db3eebc25a59"],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Burgundy Rose Bundle',
    category: 'Roses',
    description: 'Rich burgundy roses exuding sophistication and deep romance.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ["1502977249166-824b3a8a4d6d"],
    stockQuantity: 14, lowStockThreshold: 7, unitCost: 0, sold: 0
  },
  {
    name: 'Two-Tone Roses',
    category: 'Roses',
    description: 'Stunning bi-color roses with pink and cream gradients on each petal.',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    photoIds: ["1455659817273-f96807779a8a"],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Mini Rose Collection',
    category: 'Roses',
    description: 'Delicate miniature roses in mixed colors, adorably sweet.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&auto=format&fit=crop',
    photoIds: ["1508610048659-a06b669e3321"],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Peach Drift Roses',
    category: 'Roses',
    description: 'Peachy-pink drift roses with a sweet honey-like fragrance.',
    price: 13500,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    photoIds: ["1487530811015-780bab8b3621"],
    stockQuantity: 20, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Rose & Greenery Mix',
    category: 'Roses',
    description: 'A lush mix of red roses paired with fresh eucalyptus and greenery.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ["1591886960571-74d43a9d4166"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Infinity Rose Box',
    category: 'Roses',
    description: 'Preserved roses in a luxury box that last up to a year.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?w=600&auto=format&fit=crop',
    photoIds: ["1519163219899-21d2bb723b3e"],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Classic Red Dozen',
    category: 'Roses',
    description: 'The timeless classic — a dozen perfect red roses wrapped in luxury.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&auto=format&fit=crop',
    photoIds: ["1459411552884-841db9b3cc2a"],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 0, sold: 0
  },

  // ===== TULIPS (15) =====
  {
    name: 'Sunshine Tulips',
    category: 'Tulips',
    description: 'Bright and cheerful yellow tulips to bring a smile to anyone\'s face.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&auto=format&fit=crop',
    photoIds: ["1490750967868-88df5691cc5e"],
    stockQuantity: 15, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Pink Tulip Dream',
    category: 'Tulips',
    description: 'Soft pink tulips that radiate elegance and feminine charm.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1520302630591-df1c64ecb1c2?w=600&auto=format&fit=crop',
    photoIds: ["1520302630591-df1c64ecb1c2"],
    stockQuantity: 20, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Red Tulip Romance',
    category: 'Tulips',
    description: 'Bold red tulips, a symbol of perfect love and deep passion.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop',
    photoIds: ["1453728013993-6d66e9c9123a"],
    stockQuantity: 18, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Purple Tulip Magic',
    category: 'Tulips',
    description: 'Rich purple tulips representing royalty, elegance and refinement.',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&auto=format&fit=crop',
    photoIds: ["1468327768560-75b778cbb551"],
    stockQuantity: 16, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'White Tulip Purity',
    category: 'Tulips',
    description: 'Crisp white tulips symbolizing purity, forgiveness and respect.',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop',
    photoIds: ["1508193638397-1c4234db14d8"],
    stockQuantity: 22, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Orange Tulip Burst',
    category: 'Tulips',
    description: 'Vivid orange tulips bursting with warmth and positive energy.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1550948537-130a1ce83314?w=600&auto=format&fit=crop',
    photoIds: ["1550948537-130a1ce83314"],
    stockQuantity: 14, lowStockThreshold: 7, unitCost: 0, sold: 0
  },
  {
    name: 'Parrot Tulips',
    category: 'Tulips',
    description: 'Exotic parrot tulips with ruffled, multicolored petals in pink and green.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    photoIds: ["1487530811015-780bab8b3621"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Double Tulip Delight',
    category: 'Tulips',
    description: 'Double-petaled tulips that resemble peonies — full, lush and stunning.',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&auto=format&fit=crop',
    photoIds: ["1496062031456-07b8f162a322"],
    stockQuantity: 12, lowStockThreshold: 6, unitCost: 0, sold: 0
  },
  {
    name: 'Fringe Tulips',
    category: 'Tulips',
    description: 'Unique fringed tulips with crystal-like edges for a dramatic effect.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    photoIds: ["1518709268805-4e9042af9f23"],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Tulip Rainbow Mix',
    category: 'Tulips',
    description: 'A vibrant mix of tulips in red, yellow, orange, pink and white.',
    price: 13500,
    image: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=600&auto=format&fit=crop',
    photoIds: ["1465189684280-6a8fa9b19a7a"],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Black Tulip Mystery',
    category: 'Tulips',
    description: 'Rare dark maroon-black tulips that make a bold and dramatic statement.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ["1502977249166-824b3a8a4d6d"],
    stockQuantity: 7, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Lily-Flowered Tulips',
    category: 'Tulips',
    description: 'Elegant lily-shaped tulips with pointed petals that curve outward gracefully.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 13, lowStockThreshold: 6, unitCost: 0, sold: 0
  },
  {
    name: 'Triumph Tulips',
    category: 'Tulips',
    description: 'Classic triumph tulips in deep magenta, strong-stemmed and long-lasting.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&auto=format&fit=crop',
    photoIds: ["1559563362-c667ba5f5480"],
    stockQuantity: 20, lowStockThreshold: 8, unitCost: 0, sold: 0
  },
  {
    name: 'Spring Tulip Garden',
    category: 'Tulips',
    description: 'A lush spring arrangement of mixed pastel tulips in full bloom.',
    price: 17000,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&auto=format&fit=crop',
    photoIds: ["1548094990-c16ca90f1f0d"],
    stockQuantity: 15, lowStockThreshold: 7, unitCost: 0, sold: 0
  },
  {
    name: 'Tulip & Rose Fusion',
    category: 'Tulips',
    description: 'A beautiful fusion bouquet of tulips and roses in complementary shades.',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ["1591886960571-74d43a9d4166"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },

  // ===== PEONIES (15) =====
  {
    name: 'Pink Peony Perfection',
    category: 'Peonies',
    description: 'Lush and fragrant pink peonies, a seasonal favorite for weddings.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    photoIds: ["1487530811015-780bab8b3621"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'White Peony Cloud',
    category: 'Peonies',
    description: 'Dreamy white peonies that look like soft clouds of petals.',
    price: 24000,
    image: 'https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?w=600&auto=format&fit=crop',
    photoIds: ["1519163219899-21d2bb723b3e"],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Coral Peony Bliss',
    category: 'Peonies',
    description: 'Warm coral peonies with a sunset-like glow, perfect for celebrations.',
    price: 23000,
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop',
    photoIds: ["1527061011665-3652c757a4d4"],
    stockQuantity: 9, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Red Peony Passion',
    category: 'Peonies',
    description: 'Deep red peonies radiating passion, strength and bold beauty.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    photoIds: ["1518709268805-4e9042af9f23"],
    stockQuantity: 7, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Blush Peony Romance',
    category: 'Peonies',
    description: 'Delicate blush peonies in the softest shade of pink imaginable.',
    price: 22500,
    image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=600&auto=format&fit=crop',
    photoIds: ["1496062031456-07b8f162a322"],
    stockQuantity: 11, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Peony Garden Bouquet',
    category: 'Peonies',
    description: 'A lush garden-style bouquet featuring multiple peony varieties.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ["1591886960571-74d43a9d4166"],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Peony & Eucalyptus',
    category: 'Peonies',
    description: 'Pink peonies beautifully paired with silver eucalyptus for a modern look.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?w=600&auto=format&fit=crop',
    photoIds: ["1465189684280-6a8fa9b19a7a"],
    stockQuantity: 8, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Pastel Peony Mix',
    category: 'Peonies',
    description: 'A romantic mix of pastel peonies in pink, lilac and cream.',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=600&auto=format&fit=crop',
    photoIds: ["1548094990-c16ca90f1f0d"],
    stockQuantity: 9, lowStockThreshold: 4, unitCost: 0, sold: 0
  },
  {
    name: 'Itoh Peony Luxury',
    category: 'Peonies',
    description: 'Rare Itoh hybrid peonies with spectacular yellow and pink blooms.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&auto=format&fit=crop',
    photoIds: ["1559563362-c667ba5f5480"],
    stockQuantity: 4, lowStockThreshold: 2, unitCost: 0, sold: 0
  },
  {
    name: 'Tree Peony Collection',
    category: 'Peonies',
    description: 'Majestic tree peony blooms, larger and more dramatic than regular peonies.',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ["1502977249166-824b3a8a4d6d"],
    stockQuantity: 5, lowStockThreshold: 2, unitCost: 0, sold: 0
  },
  {
    name: 'Peony Wedding Bundle',
    category: 'Peonies',
    description: 'A premium wedding bundle of white and blush peonies for the big day.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    photoIds: ["1455659817273-f96807779a8a"],
    stockQuantity: 5, lowStockThreshold: 2, unitCost: 0, sold: 0
  },
  {
    name: 'Bomb Peony Delight',
    category: 'Peonies',
    description: 'Bomb-type peonies with a globe-shaped center packed with petals.',
    price: 24500,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 10, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Peony & Rose Crown',
    category: 'Peonies',
    description: 'An opulent mix of peonies and garden roses in blush and cream tones.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1519163219899-21d2bb723b3e?w=600&auto=format&fit=crop',
    photoIds: ["1519163219899-21d2bb723b3e"],
    stockQuantity: 6, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Japanese Peony',
    category: 'Peonies',
    description: 'Authentic Japanese-style peonies with single petals and golden stamens.',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop',
    photoIds: ["1527061011665-3652c757a4d4"],
    stockQuantity: 7, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Peony Centerpiece',
    category: 'Peonies',
    description: 'A stunning peony centerpiece arrangement for tables and special events.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ["1591886960571-74d43a9d4166"],
    stockQuantity: 4, lowStockThreshold: 2, unitCost: 0, sold: 0
  },

  // ===== OTHER FLOWERS =====
  {
    name: 'Elegant Lilies',
    category: 'Lilies',
    description: 'Pure white lilies symbolizing peace and purity for formal occasions.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop',
    photoIds: ["1508193638397-1c4234db14d8"],
    stockQuantity: 8, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Golden Sunflowers',
    category: 'Sunflowers',
    description: 'Large radiant sunflowers, a symbol of loyalty and longevity.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop',
    photoIds: ["1597848212624-a19eb35e2651"],
    stockQuantity: 20, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Purple Orchid Delight',
    category: 'Orchids',
    description: 'Exotic purple orchids adding luxury and mystery to any room.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&auto=format&fit=crop',
    photoIds: ["1566694271453-390536dd1f0d"],
    stockQuantity: 5, lowStockThreshold: 3, unitCost: 0, sold: 0
  },
  {
    name: 'Lavender Fields',
    category: 'Seasonal',
    description: 'Calming and aromatic lavender, perfect for relaxation and peace.',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&auto=format&fit=crop',
    photoIds: ["1468327768560-75b778cbb551"],
    stockQuantity: 30, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Wild Daisies',
    category: 'Other',
    description: 'Simple sweet white daisies bringing meadow freshness to your home.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    photoIds: ["1502977249166-824b3a8a4d6d"],
    stockQuantity: 40, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Blue Hydrangeas',
    category: 'Other',
    description: 'Stunning blue hydrangeas with voluminous petals for a dramatic display.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    photoIds: ["1561181286-d3fee7d55364"],
    stockQuantity: 12, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Sweet Carnations',
    category: 'Other',
    description: 'Ruffled carnations in pink and white representing admiration and love.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    photoIds: ["1455659817273-f96807779a8a"],
    stockQuantity: 25, lowStockThreshold: 10, unitCost: 0, sold: 0
  },
  {
    name: 'Winter Chrysanthemum',
    category: 'Seasonal',
    description: 'Resilient chrysanthemums that bloom beautifully even in cooler weather.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&auto=format&fit=crop',
    photoIds: ["1508610048659-a06b669e3321"],
    stockQuantity: 18, lowStockThreshold: 5, unitCost: 0, sold: 0
  },
  {
    name: 'Grand Celebration Bouquet',
    category: 'Bouquets',
    description: 'Our most luxurious arrangement featuring a mix of our finest seasonal blooms.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    photoIds: ["1591886960571-74d43a9d4166"],
    stockQuantity: 5, lowStockThreshold: 3, unitCost: 0, sold: 0
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Flower.deleteMany();
    console.log('Existing flowers removed.');
    await Flower.insertMany(flowers);
    console.log(`${flowers.length} flowers seeded successfully!`);

    await User.deleteMany({ role: 'admin' });
    await User.create({
      fullName: 'Kevin Admin',
      username: 'kevinAdmin',
      email: 'admin@kevinsblooms.com',
      password: 'Admin2025',
      role: 'admin'
    });
    console.log('Admin user created: admin@kevinsblooms.com / Admin2025');

    // Seed some initial Activity Logs for the dashboard
    const ActivityLog = require('./models/ActivityLog');
    await ActivityLog.deleteMany();
    const adminUser = await User.findOne({ email: 'admin@kevinsblooms.com' });
    
    await ActivityLog.insertMany([
      {
        user: adminUser._id,
        role: 'manager',
        action: 'UPDATE_STOCK',
        targetType: 'Flower',
        details: 'Manager replenished Red Velvet Roses stock by 50 units.',
        metadata: { item: 'Red Velvet Roses', qty: 50 }
      },
      {
        user: adminUser._id,
        role: 'florist',
        action: 'READY_FOR_DELIVERY',
        targetType: 'Order',
        details: 'Florist marked Order #A1B2C3 as Ready for Delivery.',
        metadata: { orderId: 'A1B2C3', timeTaken: '15m' }
      },
      {
        user: adminUser._id,
        role: 'driver',
        action: 'OUT_FOR_DELIVERY',
        targetType: 'Order',
        details: 'Driver picked up 5 orders for the Downtown route.',
        metadata: { route: 'Downtown', count: 5 }
      }
    ]);
    console.log('Initial activity logs seeded.');

    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.env.MONGO_URI) {
  seedData();
} else {
  console.log('Please provide MONGO_URI in .env to seed data.');
}