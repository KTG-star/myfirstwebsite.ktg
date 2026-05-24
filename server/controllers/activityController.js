const ActivityLog = require('../models/ActivityLog');

const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('user', 'fullName username email')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createLog = async (userId, role, action, targetType, targetId, details, metadata = {}) => {
  try {
    await ActivityLog.create({
      user: userId,
      role,
      action,
      targetType,
      targetId,
      details,
      metadata
    });
  } catch (error) {
    console.error('Error creating activity log:', error);
  }
};

module.exports = {
  getLogs,
  createLog
};
