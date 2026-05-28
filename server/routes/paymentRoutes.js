const express = require('express');
const router = express.Router();
const { verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;
