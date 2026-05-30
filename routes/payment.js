require('dotenv').config();
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

let orders = [];

router.get('/address', (req, res) => {
  res.json({
    address: process.env.WALLET_ADDRESS,
    network: 'Arc Testnet',
    token: 'USDC',
    chainId: 5042002
  });
});

router.post('/order', (req, res) => {
  const { items, totalAmount, buyerAddress, txHash, shipping } = req.body;
  if (!items || !totalAmount || !buyerAddress) {
    return res.status(400).json({ error: 'Missing information' });
  }
  const order = {
    id: Date.now(), items, totalAmount, buyerAddress,
    txHash: txHash || null, shipping: shipping || null,
    status: txHash ? 'confirmed' : 'pending',
    createdAt: new Date().toISOString(),
    arcScanUrl: txHash ? `https://testnet.arcscan.app/tx/${txHash}` : null
  };
  orders.push(order);
  console.log('New order:', order);
  res.json({ success: true, order });
});

router.post('/review', async (req, res) => {
  const { productId, address, rating, text, txHash } = req.body;
  if (!productId || !address || !rating || !text || !txHash) {
    return res.status(400).json({ error: 'Missing information' });
  }
  const review = {
    product_id: productId,
    address,
    rating: parseInt(rating),
    text,
    tx_hash: txHash,
    arc_scan_url: `https://testnet.arcscan.app/tx/${txHash}`
  };
  const { data, error } = await supabase.from('reviews').insert([review]).select().single();
  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Could not save review' });
  }
  res.json({ success: true, review: data });
});

router.get('/reviews/:productId', async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', req.params.productId)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: 'Could not fetch reviews' });
  res.json(data || []);
});

module.exports = router;
module.exports.getOrders = () => orders;
