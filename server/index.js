import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Simple in-memory API for demo purposes
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const PORT = process.env.PORT || 4000;

// In-memory store
let transactions = [];

// Utilities
function uid(prefix = 'TRN') {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const SENDER_IDS = ['BTC1A2X', 'BTC2B3Y', 'BTC3C4Z', 'BTC4D5W', 'BTC5E6V', 'BTC6F7U', 'BTC7G8T'];
const RECEIVER_IDS = ['BTC8H9S', 'BTC9I0R', 'BTC0J1Q', 'BTC1K2P', 'BTC2L3O', 'BTC3M4N', 'BTC4N5M'];
const TIME_PATTERNS = ['normal', 'late-night', 'rapid-succession', 'weekend'];
const REASONS = [
  'Normal transaction pattern',
  'High transaction velocity detected',
  'Unusual amount for this sender',
  'New receiver with high amount',
  'Multiple transactions in short time',
  'Transaction during unusual hours',
  'Amount exceeds typical threshold',
  'Sender flagged in previous activity'
];

function computeRisk({ amount, velocity, newReceiver, timePattern }) {
  let score = Math.floor(Math.random() * 30);
  if (amount > 30000) score += 30;
  if (velocity > 5) score += 20;
  if (newReceiver) score += 15;
  if (timePattern === 'late-night' || timePattern === 'rapid-succession') score += 10;
  score = Math.min(Math.max(score, 0), 100);
  const status = score > 80 ? 'fraudulent' : score > 50 ? 'suspicious' : 'safe';
  return { score, status };
}

function randomTransaction() {
  const amount = Math.floor(Math.random() * 50000) + 100;
  const velocity = Math.floor(Math.random() * 10);
  const unusualAmount = amount > 30000;
  const newReceiver = Math.random() > 0.7;
  const timePattern = randomFrom(TIME_PATTERNS);
  const { score, status } = computeRisk({ amount, velocity, newReceiver, timePattern });

  return {
    id: uid(),
    senderId: randomFrom(SENDER_IDS),
    receiverId: randomFrom(RECEIVER_IDS),
    amount,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString(),
    riskScore: score,
    status,
    reason: randomFrom(REASONS),
    features: {
      velocity,
      unusualAmount,
      newReceiver,
      timePattern
    }
  };
}

function toSimple(tx, prev) {
  const timeDiff = prev ? Math.max(0, Math.floor((new Date(tx.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000)) : 0;
  return {
    tx_id: tx.id,
    sender: tx.senderId,
    receiver: tx.receiverId,
    amount: tx.amount,
    timestamp: tx.timestamp,
    num_outputs: Math.floor(Math.random() * 4) + 1,
    time_diff: timeDiff,
    velocity: tx.features?.velocity ?? 0
  };
}

// Seed initial data
function seed(count = 50) {
  transactions = Array.from({ length: count }, () => randomTransaction()).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

seed(50);

// Routes
app.get('/api/transactions', (req, res) => {
  // return simple transactions for the UI
  const simple = transactions.map((t, i) => toSimple(t, transactions[i + 1]));
  res.json(simple);
});

app.post('/api/transactions', (req, res) => {
  const body = req.body;
  // expected: { sender, receiver, amount, timestamp?, velocity?, num_outputs? }
  const amount = Number(body.amount || 0);
  const velocity = Number(body.velocity || Math.floor(Math.random() * 6));
  const newReceiver = Math.random() > 0.7;
  const timePattern = body.timePattern || randomFrom(TIME_PATTERNS);
  const { score, status } = computeRisk({ amount, velocity, newReceiver, timePattern });

  const tx = {
    id: uid(),
    senderId: body.sender || randomFrom(SENDER_IDS),
    receiverId: body.receiver || randomFrom(RECEIVER_IDS),
    amount,
    timestamp: body.timestamp || new Date().toISOString(),
    riskScore: score,
    status,
    reason: status === 'safe' ? 'Manual submit' : randomFrom(REASONS),
    features: { velocity, unusualAmount: amount > 30000, newReceiver, timePattern }
  };

  // push to front
  transactions.unshift(tx);

  res.status(201).json({ transaction: tx, simple: toSimple(tx, transactions[1]) });
});

app.post('/api/simulate', (req, res) => {
  const count = Math.min(1000, Number(req.body.count || 100));
  const gen = [];
  for (let i = 0; i < count; i++) {
    const tx = randomTransaction();
    transactions.unshift(tx);
    gen.push(tx);
  }
  res.json({ generated: gen.length });
});

app.get('/api/export', (req, res) => {
  // export flagged transactions (suspicious or fraudulent) as CSV
  const flagged = transactions.filter((t) => t.status !== 'safe');
  const header = ['id', 'senderId', 'receiverId', 'amount', 'timestamp', 'riskScore', 'status', 'reason'];
  const rows = flagged.map((t) => [t.id, t.senderId, t.receiverId, t.amount, t.timestamp, t.riskScore, t.status, (t.reason || '')]);
  const csv = [header.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="flagged_transactions.csv"');
  res.send(csv);
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
