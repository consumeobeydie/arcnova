let cart = JSON.parse(localStorage.getItem('arcnova-cart')) || [];
let selectedProvider = null;
const detectedProviders = [];

window.addEventListener('eip6963:announceProvider', (event) => {
  const { info, provider } = event.detail;
  if (!detectedProviders.find(p => p.info.uuid === info.uuid)) {
    detectedProviders.push({ info, provider });
  }
});

window.dispatchEvent(new Event('eip6963:requestProvider'));

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  localStorage.setItem('arcnova-cart', JSON.stringify(cart));
  updateCartCount();
  showToast(product.name + ' added to cart!');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#00D4FF;color:#000;padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;z-index:9999;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showWalletModal() {
  const existing = document.getElementById('walletModal');
  if (existing) existing.remove();
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  setTimeout(() => {
    const modal = document.createElement('div');
    modal.id = 'walletModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;';
    const walletOptions = detectedProviders.length > 0
      ? detectedProviders.map(p => '<button onclick="window.connectWithProvider(' + JSON.stringify(p.info.uuid) + ')" style="width:100%;background:#0d0d24;border:1px solid #1a1a3a;color:white;padding:16px 20px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:600;display:flex;align-items:center;gap:12px;margin-bottom:12px;"><img src="' + p.info.icon + '" width="32" height="32" style="border-radius:8px;"/><span>' + p.info.name + '</span></button>').join('')
      : window.ethereum
        ? '<button onclick="window.connectWithEthereum()" style="width:100%;background:#0d0d24;border:1px solid #1a1a3a;color:white;padding:16px 20px;border-radius:12px;cursor:pointer;font-size:15px;font-weight:600;margin-bottom:12px;">Browser Wallet</button>'
        : '<p style="color:#888;text-align:center;padding:20px;">No wallet found.</p>';
    modal.innerHTML = '<div style="background:#0d0d24;border:1px solid #1a1a3a;border-radius:20px;padding:32px;width:100%;max-width:400px;margin:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;"><h2 style="font-size:20px;font-weight:700;color:white;margin:0;">Connect Wallet</h2><button onclick="document.getElementById(\'walletModal\').remove()" style="background:none;border:none;color:#888;cursor:pointer;font-size:24px;">x</button></div><p style="color:#888;font-size:13px;margin-bottom:20px;">Select your wallet</p>' + walletOptions + '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }, 100);
}

window.connectWithProvider = async function(uuid) {
  const walletData = detectedProviders.find(p => p.info.uuid === uuid);
  if (!walletData) return;
  try {
    selectedProvider = walletData.provider;
    window.__arcnovaProvider = selectedProvider;
    const accounts = await selectedProvider.request({ method: 'eth_requestAccounts' });
    document.getElementById('walletModal').remove();
    handleAccounts(accounts);
  } catch (err) {
    if (err.code === 4001) alert('Connection rejected.');
    else alert('Could not connect: ' + err.message);
  }
};

window.connectWithEthereum = async function() {
  try {
    selectedProvider = window.ethereum;
    window.__arcnovaProvider = selectedProvider;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    document.getElementById('walletModal').remove();
    handleAccounts(accounts);
  } catch (err) {
    alert('Could not connect: ' + err.message);
  }
};

window.connectWallet = function() {
  const address = localStorage.getItem('walletAddress');
  if (address) showWalletOptions();
  else showWalletModal();
};

function handleAccounts(accounts) {
  if (!accounts || accounts.length === 0) { alert('No accounts found.'); return; }
  const address = accounts[0];
  const short = address.slice(0, 6) + '...' + address.slice(-4);
  const btn = document.getElementById('connectWallet');
  if (btn) {
    btn.textContent = short;
    btn.style.background = 'rgba(0,212,255,0.1)';
    btn.style.color = '#00D4FF';
  }
  localStorage.setItem('walletAddress', address);
  showToast('Wallet connected!');
}

function showWalletOptions() {
  const existing = document.getElementById('walletOptionsModal');
  if (existing) { existing.remove(); return; }
  const modal = document.createElement('div');
  modal.id = 'walletOptionsModal';
  modal.style.cssText = 'position:fixed;top:70px;right:24px;background:#0d0d24;border:1px solid #1a1a3a;border-radius:12px;padding:8px;z-index:99999;min-width:200px;';
  const address = localStorage.getItem('walletAddress');
  const short = address ? address.slice(0, 6) + '...' + address.slice(-4) : '';
  modal.innerHTML = '<div style="padding:12px 16px;border-bottom:1px solid #1a1a3a;margin-bottom:8px;"><div style="font-size:11px;color:#888;margin-bottom:4px;">CONNECTED</div><div style="font-family:monospace;font-size:13px;color:#00D4FF;">' + short + '</div></div><button onclick="window.copyAddress()" style="width:100%;background:none;border:none;color:#ccc;padding:10px 16px;cursor:pointer;font-size:13px;text-align:left;">Copy Address</button><button onclick="window.disconnectWallet()" style="width:100%;background:none;border:none;color:#ff4444;padding:10px 16px;cursor:pointer;font-size:13px;text-align:left;">Disconnect</button>';
  document.body.appendChild(modal);
  setTimeout(() => {
    document.addEventListener('click', (e) => { if (!modal.contains(e.target)) modal.remove(); }, { once: true });
  }, 100);
}

window.copyAddress = function() {
  const address = localStorage.getItem('walletAddress');
  if (address) { navigator.clipboard.writeText(address); showToast('Address copied!'); }
  document.getElementById('walletOptionsModal').remove();
};

window.disconnectWallet = function() {
  localStorage.removeItem('walletAddress');
  selectedProvider = null;
  window.__arcnovaProvider = null;
  const btn = document.getElementById('connectWallet');
  if (btn) { btn.textContent = 'Connect Wallet'; btn.style.background = 'none'; btn.style.color = '#00D4FF'; }
  document.getElementById('walletOptionsModal').remove();
  showToast('Wallet disconnected!');
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  window.dispatchEvent(new Event('eip6963:requestProvider'));
  const walletBtn = document.getElementById('connectWallet');
  if (walletBtn) walletBtn.addEventListener('click', window.connectWallet);
  const saved = localStorage.getItem('walletAddress');
  if (saved && walletBtn) {
    walletBtn.textContent = saved.slice(0, 6) + '...' + saved.slice(-4);
    walletBtn.style.background = 'rgba(0,212,255,0.1)';
    walletBtn.style.color = '#00D4FF';
  }
  loadFeaturedProducts();
});

async function loadFeaturedProducts() {
  const grid = document.getElementById('featuredProducts');
  if (!grid) return;
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    grid.innerHTML = products.slice(0, 3).map(p => '<div class="product-card" onclick="window.location.href=\'/product.html?id=' + p.id + '\'"><img src="' + p.image + '" alt="' + p.name + '"><div class="product-info"><div class="product-category">' + p.category + '</div><div class="product-name">' + p.name + '</div><div class="product-price">' + p.price + ' <span>USDC</span></div><button class="btn-add-cart" onclick="event.stopPropagation();addToCart(' + JSON.stringify(p).replace(/"/g, '&quot;') + ')">Add to Cart</button></div></div>').join('');
  } catch (err) { console.error(err); }
}
