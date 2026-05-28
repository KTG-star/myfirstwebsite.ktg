const Order = require('../models/Order');
const Flower = require('../models/Flower');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get comprehensive admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query; // 'day', 'month', 'year'
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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
    let customerMatch = { status: { $ne: 'Cancelled' } };
    if (period === 'day') customerMatch.createdAt = { $gte: today };
    else if (period === 'month') customerMatch.createdAt = { $gte: startOfMonth };

    const topCustomers = await Order.aggregate([
      { $match: customerMatch },
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
          email: '$userDetails.email',
          profilePicture: '$userDetails.profilePicture'
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

    // 4. Operational Oversight Snapshot
    const activeFlorists = await ActivityLog.distinct('user', { role: 'florist', createdAt: { $gte: today } });
    const activeDrivers = await ActivityLog.distinct('user', { role: 'driver', createdAt: { $gte: today } });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const readyForDelivery = await Order.countDocuments({ status: 'Ready for Delivery' });

    res.json({
      success: true,
      data: {
        revenue: {
          today: todayRevenue,
          yesterday: yesterdayRevenue,
          growth: parseFloat(revenueGrowth.toFixed(1))
        },
        topCustomers,
        stockAlerts: {
          lowStock: lowStockItems,
          outOfStock: outOfStockItems,
          lowStockCount: lowStockItems.length,
          outOfStockCount: outOfStockItems.length
        },
        operationalOversight: {
          activeFlorists: activeFlorists.length,
          activeDrivers: activeDrivers.length,
          pendingOrders,
          readyForDelivery
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reward a customer with a loyalty discount
// @route   POST /api/admin/reward-customer
// @access  Private/Admin
const rewardCustomer = async (req, res) => {
  const { userId, rewardType, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // In a real app, you might generate a coupon code here
    const discountCode = `LOYALTY-${Math.random().toString(36).substring(7).toUpperCase()}`;

    await createLog(
      req.user._id,
      'admin',
      'REWARD_CUSTOMER',
      'User',
      user._id,
      `Issued a ${rewardType} reward to ${user.fullName}. Code: ${discountCode}`,
      { rewardType, amount, discountCode }
    );

    res.json({ 
      success: true, 
      message: `Successfully rewarded ${user.fullName}`,
      data: { discountCode, user: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  rewardCustomer
};
