const Flower = require('../models/Flower');
const { emitStockUpdate } = require('../socket/stockSocket');
const { createLog } = require('./activityController');

// @desc    Get all flowers
// @route   GET /api/flowers
// @access  Public
const getFlowers = async (req, res) => {
  const { category, search, sort, page = 1, limit = 12 } = req.query;

  const query = {};
  if (category && category !== 'All') query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };

  let sortQuery = {};
  if (sort === 'Price Low-High') sortQuery.price = 1;
  else if (sort === 'Price High-Low') sortQuery.price = -1;
  else if (sort === 'Newest') sortQuery.createdAt = -1;
  else if (sort === 'Most Popular') sortQuery.sold = -1;

  const flowers = await Flower.find(query)
    .sort(sortQuery)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Flower.countDocuments(query);

  res.json({
    success: true,
    data: {
      flowers,
      total,
      pages: Math.ceil(total / limit)
    }
  });
};

// @desc    Get single flower
// @route   GET /api/flowers/:id
// @access  Public
const getFlowerById = async (req, res) => {
  const flower = await Flower.findById(req.params.id);

  if (flower) {
    res.json({ success: true, data: flower });
  } else {
    res.status(404);
    throw new Error('Flower not found');
  }
};

// @desc    Create a flower
// @route   POST /api/flowers
// @access  Private/Admin
const createFlower = async (req, res) => {
  const { name, category, description, price, image, stockQuantity, unitCost, lowStockThreshold } = req.body;

  const flower = new Flower({
    name,
    category,
    description,
    price,
    image,
    stockQuantity,
    unitCost,
    lowStockThreshold
  });

  const createdFlower = await flower.save();

  await createLog(
    req.user._id,
    'manager',
    'CREATE_FLOWER',
    'Flower',
    createdFlower._id,
    `Created new flower: ${name}`,
    { name, category, price, stockQuantity }
  );

  res.status(201).json({ success: true, data: createdFlower });
};

// @desc    Update a flower
// @route   PUT /api/flowers/:id
// @access  Private/Admin
const updateFlower = async (req, res) => {
  const { name, category, description, price, image, stockQuantity, unitCost, lowStockThreshold } = req.body;

  const flower = await Flower.findById(req.params.id);

  if (flower) {
    const oldStock = flower.stockQuantity;
    flower.name = name || flower.name;
    flower.category = category || flower.category;
    flower.description = description || flower.description;
    flower.price = price || flower.price;
    flower.image = image || flower.image;
    flower.unitCost = unitCost !== undefined ? unitCost : flower.unitCost;
    flower.lowStockThreshold = lowStockThreshold !== undefined ? lowStockThreshold : flower.lowStockThreshold;
    
    const stockChanged = stockQuantity !== undefined && stockQuantity !== flower.stockQuantity;
    flower.stockQuantity = stockQuantity !== undefined ? stockQuantity : flower.stockQuantity;

    const updatedFlower = await flower.save();

    if (stockChanged) {
      emitStockUpdate(updatedFlower._id, updatedFlower.stockQuantity);
      
      const isOutOfStock = updatedFlower.stockQuantity === 0;
      const isLowStock = updatedFlower.stockQuantity < updatedFlower.lowStockThreshold;

      await createLog(
        req.user._id,
        'manager',
        isOutOfStock ? 'OUT_OF_STOCK' : (isLowStock ? 'LOW_STOCK_ALERT' : 'UPDATE_STOCK'),
        'Flower',
        flower._id,
        isOutOfStock 
          ? `CRITICAL: ${flower.name} is now OUT OF STOCK` 
          : `Updated stock for ${flower.name}: ${oldStock} -> ${flower.stockQuantity}`,
        { 
          oldStock, 
          newStock: flower.stockQuantity,
          lowStockThreshold: flower.lowStockThreshold,
          critical: isOutOfStock
        }
      );
    } else {
      await createLog(
        req.user._id,
        'manager',
        'UPDATE_FLOWER',
        'Flower',
        flower._id,
        `Updated flower details: ${flower.name}`,
        { name: flower.name }
      );
    }

    res.json({ success: true, data: updatedFlower });
  } else {
    res.status(404);
    throw new Error('Flower not found');
  }
};

// @desc    Update flower stock
// @route   PATCH /api/flowers/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  const { stockQuantity } = req.body;

  const flower = await Flower.findById(req.params.id);

  if (flower) {
    const oldStock = flower.stockQuantity;
    flower.stockQuantity = stockQuantity;
    const updatedFlower = await flower.save();

    emitStockUpdate(updatedFlower._id, updatedFlower.stockQuantity);

    await createLog(
      req.user._id,
      'manager',
      'UPDATE_STOCK',
      'Flower',
      flower._id,
      `Updated stock for ${flower.name} from ${oldStock} to ${flower.stockQuantity}`,
      { oldStock, newStock: flower.stockQuantity }
    );

    res.json({ success: true, message: 'Stock updated', data: { stockQuantity: updatedFlower.stockQuantity } });
  } else {
    res.status(404);
    throw new Error('Flower not found');
  }
};

// @desc    Delete a flower
// @route   DELETE /api/flowers/:id
// @access  Private/Admin
const deleteFlower = async (req, res) => {
  const flower = await Flower.findById(req.params.id);

  if (flower) {
    await createLog(
      req.user._id,
      'admin',
      'DELETE_FLOWER',
      'Flower',
      flower._id,
      `Deleted flower: ${flower.name}`,
      { name: flower.name }
    );
    await flower.deleteOne();
    res.json({ success: true, message: 'Flower removed' });
  } else {
    res.status(404);
    throw new Error('Flower not found');
  }
};

module.exports = {
  getFlowers,
  getFlowerById,
  createFlower,
  updateFlower,
  updateStock,
  deleteFlower
};
