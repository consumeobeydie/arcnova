const express = require('express');
const router = express.Router();

// Ödeme adresi bilgisi
router.get('/address', (req, res) => {
  res.json({
    address: process.env.WALLET_ADDRESS,
    network: 'Arc Testnet',
    token: 'USDC',
    chainId: 1313161555
  });
});

// Sipariş kaydet
router.post('/order', (req, res) => {
  const { items, totalAmount, buyerAddress, txHash } = req.body;

  if (!items || !totalAmount || !buyerAddress) {
    return res.status(400).json({ error: 'Eksik bilgi' });
  }

  const order = {
    id: Date.now(),
    items,
    totalAmount,
    buyerAddress,
    txHash: txHash || null,
    status: txHash ? 'confirmed' : 'pending',
    createdAt: new Date().toISOString(),
    arcScanUrl: txHash ? `https://testnet.arcscan.app/tx/${txHash}` : null
  };

  console.log('Yeni sipariş:', order);

  res.json({
    success: true,
    order
  });
});

module.exports = router;