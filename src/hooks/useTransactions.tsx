import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, TransactionStats } from '@/types/transaction';
import { generateInitialTransactions, generateRandomTransaction } from '@/lib/mockData';

interface TransactionContextType {
  transactions: Transaction[];
  stats: TransactionStats;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp' | 'riskScore' | 'status'>) => void;
  latestAlert: Transaction | null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateInitialTransactions(50));
  const [latestAlert, setLatestAlert] = useState<Transaction | null>(null);

  // Calculate stats
  const stats: TransactionStats = {
    total: transactions.length,
    suspicious: transactions.filter(t => t.status === 'suspicious').length,
    safe: transactions.filter(t => t.status === 'safe').length,
    fraudulent: transactions.filter(t => t.status === 'fraudulent').length,
    avgRiskScore: Math.round(transactions.reduce((sum, t) => sum + t.riskScore, 0) / transactions.length),
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0)
  };

  // Simulate real-time transaction generation
  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = generateRandomTransaction();
      setTransactions(prev => [newTransaction, ...prev].slice(0, 100)); // Keep last 100
      
      // Set alert for high-risk transactions
      if (newTransaction.riskScore > 80) {
        setLatestAlert(newTransaction);
        setTimeout(() => setLatestAlert(null), 10000); // Clear after 10s
      }
    }, 8000); // New transaction every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const addTransaction = (data: Omit<Transaction, 'id' | 'timestamp' | 'riskScore' | 'status'>) => {
    const amount = data.amount;
    const velocity = Math.floor(Math.random() * 10);
    const unusualAmount = amount > 30000;
    
    let riskScore = Math.floor(Math.random() * 30);
    if (unusualAmount) riskScore += 30;
    if (velocity > 5) riskScore += 20;
    riskScore = Math.min(Math.max(riskScore, 0), 100);
    
    const status: Transaction['status'] = 
      riskScore > 80 ? 'fraudulent' : 
      riskScore > 50 ? 'suspicious' : 'safe';

    const newTransaction: Transaction = {
      ...data,
      id: `TRN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      timestamp: new Date(),
      riskScore,
      status,
      reason: 'User-generated transaction',
      features: {
        velocity,
        unusualAmount,
        newReceiver: true,
        timePattern: 'manual'
      }
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    if (newTransaction.riskScore > 80) {
      setLatestAlert(newTransaction);
      setTimeout(() => setLatestAlert(null), 10000);
    }
  };

  return (
    <TransactionContext.Provider value={{ transactions, stats, addTransaction, latestAlert }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
