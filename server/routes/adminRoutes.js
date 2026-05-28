const express = require('express');
const router = express.Router();
const { getAdminStats, rewardCustomer } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.post('/reward-customer', protect, admin, rewardCustomer);

module.exports = router;
