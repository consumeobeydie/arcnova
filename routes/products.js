const express = require('express');
const router = express.Router();

const products = [
  // TEKNOLOJİ
  {
    id: 1,
    name: "Arc Wireless Earbuds",
    price: 49.99,
    category: "Technology",
    image: "https://picsum.photos/seed/earbuds/400/400",
    description: "Premium wireless earbuds with noise cancellation and 24h battery life.",
    stock: 15
  },
  {
    id: 2,
    name: "Nova Smart Watch",
    price: 129.99,
    category: "Technology",
    image: "https://picsum.photos/seed/smartwatch/400/400",
    description: "Smart watch with health tracking, GPS and USDC payment support.",
    stock: 8
  },
  // GİYİM
  {
    id: 3,
    name: "Arc Genesis Hoodie",
    price: 49.99,
    category: "Clothing",
    image: "https://picsum.photos/seed/hoodie/400/400",
    description: "Premium hoodie with Arc Network theme. 100% organic cotton.",
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
  // AYAKKABI
  {
    id: 5,
    name: "Nova Sneakers",
    price: 89.99,
    category: "Shoes",
    image: "https://picsum.photos/seed/sneaker/400/400",
    description: "Limited edition sneakers with star design.",
    stock: 8
  },
  {
    id: 6,
    name: "Arc Runner Pro",
    price: 109.99,
    category: "Shoes",
    image: "https://picsum.photos/seed/shoes/400/400",
    description: "Professional running shoes with advanced cushioning.",
    stock: 12
  },
  // TAKI
  {
    id: 7,
    name: "Nova Chain Necklace",
    price: 59.99,
    category: "Jewelry",
    image: "https://picsum.photos/seed/necklace/400/400",
    description: "Sterling silver chain necklace with Arc star pendant.",
    stock: 10
  },
  {
    id: 8,
    name: "Arc Ring",
    price: 39.99,
    category: "Jewelry",
    image: "https://picsum.photos/seed/ring/400/400",
    description: "Minimalist silver ring with blockchain engraving.",
    stock: 15
  },
  // OYUNCAK
  {
    id: 9,
    name: "Arc Robot Kit",
    price: 34.99,
    category: "Toys",
    image: "https://picsum.photos/seed/robot/400/400",
    description: "Build your own robot kit. Perfect for kids aged 8+.",
    stock: 20
  },
  {
    id: 10,
    name: "Nova Puzzle 1000",
    price: 19.99,
    category: "Toys",
    image: "https://picsum.photos/seed/puzzle/400/400",
    description: "1000-piece puzzle featuring Arc Network artwork.",
    stock: 25
  },
  // KİTAP
  {
    id: 11,
    name: "Web3 for Everyone",
    price: 24.99,
    category: "Books",
    image: "https://picsum.photos/seed/book1/400/400",
    description: "A beginner's guide to blockchain, USDC and Web3.",
    stock: 30
  },
  {
    id: 12,
    name: "The Future of Money",
    price: 19.99,
    category: "Books",
    image: "https://picsum.photos/seed/book2/400/400",
    description: "How stablecoins are reshaping the global economy.",
    stock: 20
  },
  // EV & YAŞAM
  {
    id: 13,
    name: "Arc Desk Lamp",
    price: 44.99,
    category: "Home & Living",
    image: "https://picsum.photos/seed/lamp/400/400",
    description: "Smart LED desk lamp with touch control and USB-C charging.",
    stock: 18
  },
  {
    id: 14,
    name: "Nova Mug",
    price: 14.99,
    category: "Home & Living",
    image: "https://picsum.photos/seed/mug/400/400",
    description: "Double-wall insulated mug. Keeps your drink hot for 6 hours.",
    stock: 40
  },
  // KOZMETİK
  {
    id: 15,
    name: "Arc Glow Serum",
    price: 34.99,
    category: "Cosmetics",
    image: "https://picsum.photos/seed/serum/400/400",
    description: "Vitamin C brightening serum for radiant skin.",
    stock: 22
  },
  {
    id: 16,
    name: "Nova Lip Set",
    price: 22.99,
    category: "Cosmetics",
    image: "https://picsum.photos/seed/lipset/400/400",
    description: "Set of 6 long-lasting lip colors. Cruelty-free formula.",
    stock: 16
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