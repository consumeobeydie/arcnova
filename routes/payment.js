const express = require('express');
const router = express.Router();

router.post('/order', (req, res) => {
  try {
    const { items, totalAmount, buyerAddress, txHash, shipping } = req.body;
    console.log('New order:', { buyerAddress, txHash, totalAmount });
    res.json({ success: true, txHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;