const Order = require('../models/Order');
const Flower = require('../models/Flower');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get comprehensive admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Revenue Stats
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
      status: { $ne: 'Cancelled' }
    });
    const todayRevenue = todayOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    const yesterdayOrders = await Order.find({
      createdAt: { $gte: yesterday, $lt: today },
      status: { $ne: 'Cancelled' }
    });
    const yesterdayRevenue = yesterdayOrders.reduce((acc, order) => acc + order.totalAmount, 0);

    const revenueGrowth = yesterdayRevenue === 0 
      ? 100 
      : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    // 2. Top Customers (Leaderboard)
    const topCustomers = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          fullName: '$userDetails.fullName',
          email: '$userDetails.email'
        }
      }
    ]);

    // 3. Stock Alerts
    const lowStockItems = await Flower.find({
      $expr: { $lt: ['$stockQuantity', '$lowStockThreshold'] },
      stockQuantity: { $gt: 0 }
    });

    const outOfStockItems = await Flower.find({
      stockQuantity: 0
    });

    // 4. Activity Summary (last 24 hours)
    const activeFlorists = await ActivityLog.distinct('user', { role: 'florist', createdAt: { $gte: today } });
    const activeDrivers = await ActivityLog.distinct('user', { role: 'driver', createdAt: { $gte: today } });

    res.json({
      success: true,
      data: {
        revenue: {
          today: todayRevenue,
          yesterday: yesterdayRevenue,
          growth: revenueGrowth.toFixed(1)
        },
        topCustomers,
        stockAlerts: {
          lowStock: lowStockItems,
          outOfStock: outOfStockItems
        },
        activitySummary: {
          activeFlorists: activeFlorists.length,
          activeDrivers: activeDrivers.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats
};
