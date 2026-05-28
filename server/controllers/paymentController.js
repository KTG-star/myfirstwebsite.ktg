const axios = require('axios');

const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    // To get your Paystack keys:
    // 1. Go to https://paystack.com and create a free account
    // 2. Go to Settings → API Keys & Webhooks
    // 3. Copy your Test Public Key and Test Secret Key
    // 4. Add them to your .env files
    // 5. When ready to go live, use Live keys instead

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    const { data } = response.data;
    
    if (data.status === 'success') {
      res.json({
        success: true,
        message: 'Payment verified',
        data: {
          reference: data.reference,
          amount: data.amount / 100,
          status: data.status,
          paidAt: data.paid_at
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

module.exports = { verifyPayment };
