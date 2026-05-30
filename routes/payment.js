const express = require('express');
const router = express.Router();

// Bellekte saklama (Vercel için uygun)
let reviews = {};
let orders = [];

// Ödeme adresi
router.get('/address', (req, res) => {
  res.json({
    address: process.env.WALLET_ADDRESS,
    network: 'Arc Testnet',
    token: 'USDC',
    chainId: 5042002
  });
});

// Sipariş kaydet
router.post('/order', (req, res) => {
  const { items, totalAmount, buyerAddress, txHash, shipping } = req.body;

  if (!items || !totalAmount || !buyerAddress) {
    return res.status(400).json({ error: 'Missing information' });
  }

  const order = {
    id: Date.now(),
    items,
    totalAmount,
    buyerAddress,
    txHash: txHash || null,
    shipping: shipping || null,
    status: txHash ? 'confirmed' : 'pending',
    createdAt: new Date().toISOString(),
    arcScanUrl: txHash ? `https://testnet.arcscan.app/tx/${txHash}` : null
  };

  orders.push(order);
  console.log('New order:', order);
  res.json({ success: true, order });
});

// Yorum ekle
router.post('/review', (req, res) => {
  const { productId, address, rating, text, txHash } = req.body;

  if (!productId || !address || !rating || !text || !txHash) {
    return res.status(400).json({ error: 'Missing information' });
  }

  const review = {
    id: Date.now(),
    address,
    rating: parseInt(rating),
    text,
    txHash,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }),
    createdAt: new Date().toISOString(),
    arcScanUrl: `https://testnet.arcscan.app/tx/${txHash}`
  };

  if (!reviews[productId]) reviews[productId] = [];
  reviews[productId].unshift(review);

  res.json({ success: true, review });
});

// Yorumları getir
router.get('/reviews/:productId', (req, res) => {
  res.json(reviews[req.params.productId] || []);
});

module.exports = router;
module.exports.getOrders = () => orders;
