import { Transaction, SimpleTransaction } from '@/types/transaction';

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

export function generateRandomTransaction(): Transaction {
  const amount = Math.floor(Math.random() * 50000) + 100;
  const velocity = Math.floor(Math.random() * 10);
  const unusualAmount = amount > 30000;
  const newReceiver = Math.random() > 0.7;
  const timePattern = TIME_PATTERNS[Math.floor(Math.random() * TIME_PATTERNS.length)];
  
  // Calculate risk score based on factors
  let riskScore = Math.floor(Math.random() * 30); // Base score
  if (unusualAmount) riskScore += 30;
  if (velocity > 5) riskScore += 20;
  if (newReceiver) riskScore += 15;
  if (timePattern === 'late-night' || timePattern === 'rapid-succession') riskScore += 10;
  
  riskScore = Math.min(Math.max(riskScore, 0), 100);
  
  const status: Transaction['status'] = 
    riskScore > 80 ? 'fraudulent' : 
    riskScore > 50 ? 'suspicious' : 'safe';

  return {
    id: `TRN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    senderId: SENDER_IDS[Math.floor(Math.random() * SENDER_IDS.length)],
    receiverId: RECEIVER_IDS[Math.floor(Math.random() * RECEIVER_IDS.length)],
    amount,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
    riskScore,
    status,
    reason: REASONS[Math.floor(Math.random() * REASONS.length)],
    features: {
      velocity,
      unusualAmount,
      newReceiver,
      timePattern
    }
  };
}

export function generateInitialTransactions(count: number = 50): Transaction[] {
  return Array.from({ length: count }, () => generateRandomTransaction())
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// --- SimpleTransaction generator for frontend/demo purposes ---
function randomNumOutputs() {
  return Math.floor(Math.random() * 4) + 1;
}

export function toSimpleTransaction(t: Transaction, prev?: Transaction): SimpleTransaction {
  const timeDiff = prev ? Math.max(0, Math.floor((t.timestamp.getTime() - prev.timestamp.getTime()) / 1000)) : 0;
  return {
    tx_id: t.id,
    sender: t.senderId,
    receiver: t.receiverId,
    amount: t.amount,
    timestamp: t.timestamp.toISOString(),
    num_outputs: randomNumOutputs(),
    time_diff: timeDiff,
    velocity: t.features?.velocity ?? 0
  };
}

export function generateSimpleTransactions(count: number = 50): SimpleTransaction[] {
  const txs = generateInitialTransactions(count);
  // assume sorted desc by timestamp; produce simple records with time_diff relative to previous
  const simple: SimpleTransaction[] = [];
  for (let i = 0; i < txs.length; i++) {
    const prev = i < txs.length - 1 ? txs[i + 1] : undefined;
    simple.push(toSimpleTransaction(txs[i], prev));
  }
  return simple;
}
