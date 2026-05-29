const express = require('express');
const router = express.Router();

const products = [
  {
    id: 1,
    name: "Arc Genesis Hoodie",
    price: 49.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/hoodie/400/400",
    description: "Premium hoodie with Arc Network theme. 100% organic cotton.",
    stock: 15
  },
  {
    id: 2,
    name: "Nova Sneakers",
    price: 89.99,
    category: "Shoes",
    image: "https://picsum.photos/seed/sneaker/400/400",
    description: "Limited edition sneakers with star design.",
    stock: 8
  },
  {
    id: 3,
    name: "Blockchain Cap",
    price: 24.99,
    category: "Accessories",
    image: "https://picsum.photos/seed/cap/400/400",
    description: "Embroidered cap, fits every style.",
    stock: 20
  },
  {
    id: 4,
    name: "ArcNova T-Shirt",
    price: 29.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/tshirt/400/400",
    description: "Minimal design, premium quality.",
    stock: 30
  },
  {
    id: 5,
    name: "Web3 Backpack",
    price: 69.99,
    category: "Bags",
    image: "https://picsum.photos/seed/backpack/400/400",
    description: "Laptop compartment, waterproof backpack.",
    stock: 12
  },
  {
    id: 6,
    name: "Nova Watch",
    price: 129.99,
    category: "Accessories",
    image: "https://picsum.photos/seed/watch/400/400",
    description: "Minimalist design, leather strap.",
    stock: 5
  }
];

router.get('/', (req, res) => {
  const { category, search } = req.query;
  let filtered = products;

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

module.exports = router;