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

export interface TransactionStats {
  total: number;
  suspicious: number;
  safe: number;
  fraudulent: number;
  avgRiskScore: number;
  totalVolume: number;
}
