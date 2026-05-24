require('dotenv').config();
const mongoose = require('mongoose');
const Flower = require('./models/Flower');
const User = require('./models/User');

const flowers = [
  {
    name: 'Red Velvet Roses',
    category: 'Roses',
    description: 'A classic bouquet of deep red roses, perfect for expressing love and passion.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
    stockQuantity: 25
  },
  {
    name: 'Sunshine Tulips',
    category: 'Tulips',
    description: 'Bright and cheerful yellow tulips to bring a smile to anyone\'s face.',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5e?w=600&auto=format&fit=crop',
    stockQuantity: 15
  },
  {
    name: 'Elegant Lilies',
    category: 'Lilies',
    description: 'Pure white lilies that symbolize peace and purity. Ideal for formal occasions.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&auto=format&fit=crop',
    stockQuantity: 8
  },
  {
    name: 'Golden Sunflowers',
    category: 'Sunflowers',
    description: 'Large, radiant sunflowers that follow the sun. A symbol of loyalty and longevity.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop',
    stockQuantity: 20
  },
  {
    name: 'Purple Orchid Delight',
    category: 'Orchids',
    description: 'Exotic purple orchids that add a touch of luxury and mystery to any room.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1566694271453-390536dd1f0d?w=600&auto=format&fit=crop',
    stockQuantity: 5
  },
  {
    name: 'Pink Peony Perfection',
    category: 'Peonies',
    description: 'Lush and fragrant pink peonies, a seasonal favorite for weddings and celebrations.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1487530811015-780bab8b3621?w=600&auto=format&fit=crop',
    stockQuantity: 10
  },
  {
    name: 'Lavender Fields',
    category: 'Seasonal',
    description: 'Calming and aromatic lavender, perfect for relaxation and peace.',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=600&auto=format&fit=crop',
    stockQuantity: 30
  },
  {
    name: 'Wild Daisies',
    category: 'Other',
    description: 'Simple and sweet white daisies, bringing the freshness of the meadow to your home.',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?w=600&auto=format&fit=crop',
    stockQuantity: 40
  },
  {
    name: 'Blue Hydrangeas',
    category: 'Other',
    description: 'Stunning blue hydrangeas with voluminous petals for a dramatic floral display.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop',
    stockQuantity: 12
  },
  {
    name: 'Sweet Carnations',
    category: 'Other',
    description: 'Ruffled carnations in various shades of pink and white, representing admiration and love.',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600&auto=format&fit=crop',
    stockQuantity: 25
  },
  {
    name: 'Winter Chrysanthemum',
    category: 'Seasonal',
    description: 'Resilient and beautiful chrysanthemums that bloom even in cooler weather.',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&auto=format&fit=crop',
    stockQuantity: 18
  },
  {
    name: 'Grand Celebration Bouquet',
    category: 'Bouquets',
    description: 'Our most luxurious arrangement, featuring a mix of our finest seasonal blooms.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&auto=format&fit=crop',
    stockQuantity: 5
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Seed Flowers
    await Flower.deleteMany();
    console.log('Existing flowers removed.');
    await Flower.insertMany(flowers);
    console.log('12 flowers seeded successfully.');

    // Seed Admin User
    await User.deleteMany({ role: 'admin' });
    const adminExists = await User.findOne({ email: 'admin@kevinsblooms.com' });
    if (!adminExists) {
      await User.create({
        fullName: 'Kevin Admin',
        username: 'admin',
        email: 'admin@kevinsblooms.com',
        password: 'Admin2025',
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }

    console.log('Seeding complete.');
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
