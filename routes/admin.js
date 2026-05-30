require('dotenv').config();
const express = require('express');
const router = express.Router();

const ADMIN_WALLET = (process.env.ADMIN_WALLET || process.env.WALLET_ADDRESS || '').toLowerCase();
const STORE_WALLET = process.env.WALLET_ADDRESS || '';
const USDC_CONTRACT = process.env.USDC_CONTRACT || '0x3600000000000000000000000000000000000000';
const ARC_RPC = process.env.ARC_RPC || 'https://arc-testnet.drpc.org';
const ARCSCAN_API = 'https://testnet.arcscan.app/api';

let _paymentModule = null;
function getOrders() {
  try {
    if (!_paymentModule) _paymentModule = require('./payment');
    if (typeof _paymentModule.getOrders === 'function') return _paymentModule.getOrders();
  } catch(e) {}
  return [];
}

function requireAdmin(req, res, next) {
  const wallet = (req.headers['x-admin-wallet'] || '').toLowerCase();
  if (!wallet || wallet !== ADMIN_WALLET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

async function fetchFromArcScan() {
  const url = `${ARCSCAN_API}?module=account&action=tokentx&contractaddress=${USDC_CONTRACT}&address=${STORE_WALLET}&sort=desc`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const data = await res.json();
  if (data.status !== '1' || !Array.isArray(data.result)) throw new Error('ArcScan: ' + (data.message || 'no data'));
  return data.result
    .filter(tx => tx.to?.toLowerCase() === STORE_WALLET.toLowerCase())
    .map(tx => ({
      hash: tx.hash,
      from: tx.from,
      value: parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || 6)),
      blockNumber: parseInt(tx.blockNumber),
      timestamp: tx.timeStamp ? new Date(parseInt(tx.timeStamp) * 1000).toISOString() : null,
      source: 'arcscan'
    }));
}

async function fetchFromRPC() {
  const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
  const paddedStore = '0x000000000000000000000000' + STORE_WALLET.replace('0x', '').toLowerCase();
  const blockRes = await fetch(ARC_RPC, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
    signal: AbortSignal.timeout(8000)
  });
  const blockData = await blockRes.json();
  const latest = parseInt(blockData.result, 16);
  const fromBlock = '0x' + Math.max(0, latest - 50000).toString(16);
  const logsRes = await fetch(ARC_RPC, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'eth_getLogs', id: 2,
      params: [{ fromBlock, toBlock: 'latest', address: USDC_CONTRACT, topics: [TRANSFER_TOPIC, null, paddedStore] }]
    }),
    signal: AbortSignal.timeout(10000)
  });
  const logsData = await logsRes.json();
  if (!Array.isArray(logsData.result)) throw new Error('RPC: invalid response');
  return logsData.result.map(log => ({
    hash: log.transactionHash,
    from: '0x' + log.topics[1].slice(26),
    value: parseInt(log.data, 16) / 1e6,
    blockNumber: parseInt(log.blockNumber, 16),
    timestamp: null,
    source: 'rpc'
  }));
}

async function fetchOnChainTxs() {
  try {
    const txs = await fetchFromArcScan();
    return { txs, source: 'arcscan' };
  } catch (e1) {
    console.warn('[Admin] ArcScan failed:', e1.message, '— trying RPC');
    try {
      const txs = await fetchFromRPC();
      return { txs, source: 'rpc' };
    } catch (e2) {
      throw new Error(`ArcScan: ${e1.message} | RPC: ${e2.message}`);
    }
  }
}

function calcStats(txs, orders) {
  const totalRevenue = txs.reduce((sum, tx) => sum + tx.value, 0);
  const uniqueWallets = [...new Set(txs.map(tx => tx.from.toLowerCase()))];
  const walletMap = {};
  txs.forEach(tx => {
    const addr = tx.from.toLowerCase();
    if (!walletMap[addr]) walletMap[addr] = { address: tx.from, orderCount: 0, totalSpent: 0 };
    walletMap[addr].orderCount++;
    walletMap[addr].totalSpent += tx.value;
  });
  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(6)),
    totalOrders: txs.length,
    uniqueWalletCount: uniqueWallets.length,
    wallets: Object.values(walletMap).sort((a, b) => b.totalSpent - a.totalSpent),
    memoryOrders: orders.length
  };
}

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const { txs, source } = await fetchOnChainTxs();
    const orders = getOrders();
    const stats = calcStats(txs, orders);
    res.json({ success: true, source, stats, transactions: txs.slice(0, 100), orders: orders.slice(-50).reverse() });
  } catch (e) {
    console.error('[Admin] stats error:', e.message);
    res.status(502).json({ success: false, error: e.message });
  }
});

router.get('/orders', requireAdmin, (req, res) => {
  const orders = getOrders();
  res.json({ success: true, orders: orders.slice().reverse() });
});

module.exports = router;

