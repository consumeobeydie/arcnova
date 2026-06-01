const express = require('express');
const router = express.Router();

const SUPABASE_URL = 'https://rxncooatoyouotkqgksb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bmNvb2F0b3lvdW90a3Fna3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjU1NTEsImV4cCI6MjA5NTcwMTU1MX0.nPweOQmGge3dlxc9eIz3VJIGup_OshpaygoAUB9BMIs';

async function supabase(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Sipariş kaydet
router.post('/order', async (req, res) => {
  try {
    const { items, totalAmount, buyerAddress, txHash, shipping } = req.body;
    console.log('New order:', { buyerAddress, txHash, totalAmount });
    res.json({ success: true, txHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yorum kaydet
router.post('/review', async (req, res) => {
  try {
    const { productId, address, rating, text, txHash } = req.body;
    if (!productId || !address || !rating || !text || !txHash) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    await supabase('reviews', 'POST', {
      product_id: parseInt(productId),
      address,
      rating: parseInt(rating),
      text,
      tx_hash: txHash
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Review error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Yorumları getir
router.get('/reviews/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const data = await supabase(
      `reviews?product_id=eq.${productId}&order=created_at.desc`,
      'GET'
    );
    res.json(data);
  } catch (err) {
    console.error('Reviews fetch error:', err.message);
    res.json([]);
  }
});

module.exports = router;