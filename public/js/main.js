let cart = JSON.parse(localStorage.getItem('arcnova-cart')) || [];
let selectedProvider = null;

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('arcnova-cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${product.name} added to cart! 🛒`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: #00D4AA; color: #000;
    padding: 12px 24px; border-radius: 12px;
    font-weight: 600; font-size: 14px;
    z-index: 9999;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// EIP-6963 provider discovery
const providers = [];

window.addEventListener('eip6963:announceProvider', (event) => {
  providers.push(event.detail);
});

window.dispatchEvent(new Event('eip6963:requestProvider'));

async function connectWallet() {
  try {
    // EIP-6963 ile dene
    if (providers.length > 0) {
      const metamask = providers.find(p => p.info.name.toLowerCase().includes('metamask')) || providers[0];
      selectedProvider = metamask.provider;
      const accounts = await selectedProvider.request({ method: 'eth_requestAccounts' });
      handleAccounts(accounts);
      return;
    }

    // window.ethereum ile dene
    if (window.ethereum) {
      selectedProvider = window.ethereum;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      handleAccounts(accounts);
      return;
    }

    alert('MetaMask not found! Please install MetaMask.');

  } catch (err) {
    console.error('Wallet error:', err);
    if (err.code === 4001) {
      alert('Connection rejected. Please approve in MetaMask.');
    } else {
      alert('Could not connect: ' + err.message);
    }
  }
}

function handleAccounts(accounts) {
  if (!accounts || accounts.length === 0) {
    alert('No accounts found.');
    return;
  }
  const address = accounts[0];
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const btn = document.getElementById('connectWallet');
  if (btn) {
    btn.textContent = `✅ ${short}`;
    btn.style.background = 'rgba(0,212,170,0.1)';
    btn.style.color = '#00D4AA';
  }
  localStorage.setItem('walletAddress', address);
  localStorage.setItem('arcnova-provider', 'connected');
  showToast('Wallet connected! ✅');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // EIP-6963 provider iste
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  const walletBtn = document.getElementById('connectWallet');
  if (walletBtn) walletBtn.addEventListener('click', connectWallet);

  const saved = localStorage.getItem('walletAddress');
  if (saved && walletBtn) {
    const short = `${saved.slice(0, 6)}...${saved.slice(-4)}`;
    walletBtn.textContent = `✅ ${short}`;
    walletBtn.style.background = 'rgba(0,212,170,0.1)';
    walletBtn.style.color = '#00D4AA';
  }

  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;

  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    const featured = products.slice(0, 3);

    grid.innerHTML = featured.map(p => `
      <div class="product-card" onclick="window.location.href='/product.html?id=${p.id}'">
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <div class="product-category">${p.category}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">${p.price} <span>USDC</span></div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}