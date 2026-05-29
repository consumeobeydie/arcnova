require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Routes
const productsRoute = require('./routes/products');
const paymentRoute = require('./routes/payment');

app.use('/api/products', productsRoute);
app.use('/api/payment', paymentRoute);

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ArcNova çalışıyor: http://localhost:${PORT}`);
});