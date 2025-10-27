export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: Date;
  riskScore: number;
  status: 'safe' | 'suspicious' | 'fraudulent';
  reason?: string;
  features?: {
    velocity: number;
    unusualAmount: boolean;
    newReceiver: boolean;
    timePattern: string;
  };
}

// Simple, frontend-friendly transaction record used for visualization and rule/ML features
export interface SimpleTransaction {
  tx_id: string; // unique transaction id
  sender: string; // sender identifier
  receiver: string; // receiver identifier
  amount: number; // amount in smallest unit or agreed-upon unit
  timestamp: string; // ISO string for easy transport/serialization
  num_outputs: number; // number of outputs in the transaction
  time_diff: number; // seconds since previous transaction of interest (e.g. same sender)
  velocity: number; // simple velocity metric (e.g. txs per minute or similar)
}

export interface TransactionStats {
  total: number;
  suspicious: number;
  safe: number;
  fraudulent: number;
  avgRiskScore: number;
  totalVolume: number;
}
