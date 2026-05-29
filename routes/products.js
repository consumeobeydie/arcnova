const express = require('express');
const router = express.Router();

const products = [
  // TECHNOLOGY
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 0.005,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
    description: "Premium wireless headphones with active noise cancellation and 30h battery life.",
    stock: 15
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 0.005,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
    description: "Smart watch with health tracking, GPS and USDC payment support.",
    stock: 8
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 0.004,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&auto=format",
    description: "RGB mechanical keyboard with tactile switches and aluminum body.",
    stock: 12
  },
  {
    id: 4,
    name: "Portable Speaker",
    price: 0.003,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop&auto=format",
    description: "Waterproof portable speaker with 360° sound and 24h battery.",
    stock: 20
  },
  {
    id: 5,
    name: "Wireless Mouse",
    price: 0.002,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&auto=format",
    description: "Ergonomic wireless mouse with silent click and long battery life.",
    stock: 10
  },

  // CLOTHING
  {
    id: 6,
    name: "Classic White Oxford Shirt",
    price: 0.003,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=400&fit=crop&auto=format",
    description: "Premium cotton oxford shirt, perfect for any occasion.",
    stock: 25
  },
  {
    id: 7,
    name: "Black Slim Fit Jeans",
    price: 0.004,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&auto=format",
    description: "Stretch slim fit jeans with premium denim fabric.",
    stock: 30
  },
  {
    id: 8,
    name: "Oversized Hoodie",
    price: 0.003,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop&auto=format",
    description: "Cozy oversized hoodie made from 100% organic cotton.",
    stock: 20
  },
  {
    id: 9,
    name: "Wool Blazer",
    price: 0.005,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop&auto=format",
    description: "Elegant wool blend blazer for a sharp professional look.",
    stock: 15
  },
  {
    id: 10,
    name: "Linen Summer Dress",
    price: 0.003,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
    description: "Lightweight linen dress perfect for warm summer days.",
    stock: 18
  },

  // SHOES
  {
    id: 11,
    name: "White Leather Sneakers",
    price: 0.004,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&auto=format",
    description: "Classic white leather sneakers that go with everything.",
    stock: 20
  },
  {
    id: 12,
    name: "Running Shoes",
    price: 0.005,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop&auto=format",
    description: "Lightweight running shoes with advanced cushioning technology.",
    stock: 15
  },
  {
    id: 13,
    name: "Chelsea Boots",
    price: 0.005,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&h=400&fit=crop&auto=format",
    description: "Genuine leather Chelsea boots with elastic side panels.",
    stock: 10
  },
  {
    id: 14,
    name: "Slip-On Loafers",
    price: 0.003,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1619138622990-4b5c86e9e21c?w=400&h=400&fit=crop&auto=format",
    description: "Comfortable slip-on loafers in premium suede.",
    stock: 12
  },
  {
    id: 15,
    name: "High-Top Sneakers",
    price: 0.004,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop&auto=format",
    description: "Stylish high-top sneakers with ankle support.",
    stock: 8
  },

  // JEWELRY
  {
    id: 16,
    name: "Diamond Stud Earrings",
    price: 0.005,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&auto=format",
    description: "Elegant diamond stud earrings in 18k white gold setting.",
    stock: 10
  },
  {
    id: 17,
    name: "Gold Chain Necklace",
    price: 0.005,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&auto=format",
    description: "18k gold chain necklace, 45cm length.",
    stock: 12
  },
  {
    id: 18,
    name: "Silver Bangle Bracelet",
    price: 0.002,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&auto=format",
    description: "Sterling silver bangle bracelet with engraved pattern.",
    stock: 15
  },
  {
    id: 19,
    name: "Rose Gold Ring",
    price: 0.003,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&auto=format",
    description: "Delicate rose gold ring with minimalist design.",
    stock: 20
  },
  {
    id: 20,
    name: "Pearl Drop Earrings",
    price: 0.004,
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&auto=format",
    description: "Classic freshwater pearl drop earrings in gold setting.",
    stock: 8
  },

  // TOYS
  {
    id: 21,
    name: "LEGO City Set",
    price: 0.004,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop&auto=format",
    description: "Creative LEGO city set for ages 6+.",
    stock: 20
  },
  {
    id: 22,
    name: "Remote Control Car",
    price: 0.003,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&auto=format",
    description: "High-speed remote control car with 4WD and LED lights.",
    stock: 15
  },
  {
    id: 23,
    name: "Wooden Puzzle Set",
    price: 0.002,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=400&fit=crop&auto=format",
    description: "Educational wooden puzzle set for children aged 3+.",
    stock: 25
  },
  {
    id: 24,
    name: "Plush Teddy Bear",
    price: 0.001,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&h=400&fit=crop&auto=format",
    description: "Super soft plush teddy bear, 40cm tall.",
    stock: 30
  },
  {
    id: 25,
    name: "Science Experiment Kit",
    price: 0.003,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=400&fit=crop&auto=format",
    description: "Fun science experiment kit for curious kids aged 8+.",
    stock: 18
  },

  // BOOKS
  {
    id: 26,
    name: "The Psychology of Money",
    price: 0.001,
    category: "Books",
    image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?w=400&h=400&fit=crop&auto=format",
    description: "Timeless lessons on wealth, greed, and happiness.",
    stock: 30
  },
  {
    id: 27,
    name: "Atomic Habits",
    price: 0.001,
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop&auto=format",
    description: "An easy and proven way to build good habits and break bad ones.",
    stock: 25
  },
  {
    id: 28,
    name: "Web3 Developer Guide",
    price: 0.002,
    category: "Books",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop&auto=format",
    description: "Complete guide to building decentralized applications.",
    stock: 20
  },
  {
    id: 29,
    name: "The Future of Finance",
    price: 0.002,
    category: "Books",
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=400&fit=crop&auto=format",
    description: "How blockchain and stablecoins are reshaping global finance.",
    stock: 15
  },
  {
    id: 30,
    name: "Design Thinking",
    price: 0.001,
    category: "Books",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop&auto=format",
    description: "A guide to creative problem solving and innovation.",
    stock: 20
  },

  // HOME & LIVING
  {
    id: 31,
    name: "Ceramic Coffee Mug Set",
    price: 0.002,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop&auto=format",
    description: "Set of 4 handcrafted ceramic mugs in earthy tones.",
    stock: 20
  },
  {
    id: 32,
    name: "Scented Soy Candle",
    price: 0.001,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=400&fit=crop&auto=format",
    description: "Hand-poured soy wax candle with lavender and vanilla scent.",
    stock: 35
  },
  {
    id: 33,
    name: "Minimalist Desk Lamp",
    price: 0.003,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&auto=format",
    description: "LED desk lamp with adjustable brightness and USB charging port.",
    stock: 18
  },
  {
    id: 34,
    name: "Linen Throw Pillow",
    price: 0.002,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=400&h=400&fit=crop&auto=format",
    description: "Soft linen throw pillow with natural texture, 45x45cm.",
    stock: 25
  },
  {
    id: 35,
    name: "Bamboo Kitchen Organizer",
    price: 0.002,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format",
    description: "Eco-friendly bamboo kitchen organizer with 4 compartments.",
    stock: 22
  },

  // COSMETICS
  {
    id: 36,
    name: "Vitamin C Face Serum",
    price: 0.003,
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&auto=format",
    description: "Brightening vitamin C serum for radiant, glowing skin.",
    stock: 25
  },
  {
    id: 37,
    name: "Hydrating Face Cream",
    price: 0.004,
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop&auto=format",
    description: "Deep hydration face cream with hyaluronic acid and ceramides.",
    stock: 20
  },
  {
    id: 38,
    name: "Natural Lip Balm Set",
    price: 0.001,
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&auto=format",
    description: "Set of 5 natural lip balms in berry, vanilla and mint flavors.",
    stock: 40
  },
  {
    id: 39,
    name: "Rose Water Toner",
    price: 0.002,
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=400&fit=crop&auto=format",
    description: "Pure rose water facial toner for hydration and pore tightening.",
    stock: 30
  },
  {
    id: 40,
    name: "Eyeshadow Palette",
    price: 0.003,
    category: "Cosmetics",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&auto=format",
    description: "18-shade eyeshadow palette with matte and shimmer finishes.",
    stock: 15
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