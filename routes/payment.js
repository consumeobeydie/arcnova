async function makePayment() {
  const wallet = localStorage.getItem('walletAddress');
  if (!wallet) { alert('Please connect your wallet first!'); return; }

  const payBtn = document.getElementById('payBtn');
  const statusEl = document.getElementById('paymentStatus');
  const errorEl = document.getElementById('errorMsg');

  try {
    payBtn.disabled = true;
    payBtn.textContent = 'Switching to Arc Testnet...';
    statusEl.style.display = 'block';
    statusEl.textContent = 'Switching to Arc Testnet...';
    errorEl.style.display = 'none';

    let ethProvider = window.__arcnovaProvider || window.ethereum;
    await switchToArc(ethProvider);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 0.001;
    // ERC-20 interface: 6 decimals
    const amountInUnits = Math.round(total * 1e6);

    // to adresi 32 byte'a pad'lendi
    const paddedTo = STORE_WALLET.replace('0x', '').toLowerCase().padStart(64, '0');
    const paddedAmount = amountInUnits.toString(16).padStart(64, '0');

    // transfer(address,uint256) function selector
    const transferData = '0xa9059cbb' + paddedTo + paddedAmount;

    statusEl.textContent = 'Please confirm the transaction in your wallet...';
    payBtn.textContent = 'Waiting for confirmation...';

    const txHash = await ethProvider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: wallet,
        to: USDC_CONTRACT,
        data: transferData,
        // gas değeri hex olarak daha yüksek tutuldu
        gas: '0x30D40'
      }]
    });

    // Sipariş kaydı
    await fetch('/api/payment/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        totalAmount: total.toFixed(6),
        buyerAddress: wallet,
        txHash,
        shipping: {
          name: document.getElementById('fullName').value || null,
          email: document.getElementById('email').value || null,
          address: document.getElementById('shippingAddress').value || null,
        }
      })
    });

    cart = [];
    localStorage.setItem('arcnova-cart', JSON.stringify(cart));
    updateCartCount();

    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    document.getElementById('step3circle').style.background = '#00D4FF';
    document.getElementById('step3circle').style.color = '#000';
    document.getElementById('step3text').style.color = '#00D4FF';

    document.getElementById('txHashDisplay').textContent = txHash;
    document.getElementById('arcScanLink').href = 'https://testnet.arcscan.app/tx/' + txHash;

    showToast('Payment confirmed on blockchain!');

  } catch (err) {
    console.error(err);
    payBtn.disabled = false;
    payBtn.textContent = 'Pay with USDC';
    statusEl.style.display = 'none';
    errorEl.textContent = err.code === 4001
      ? 'Transaction rejected.'
      : 'Error: ' + (err.reason || err.message);
    errorEl.style.display = 'block';
  }
}