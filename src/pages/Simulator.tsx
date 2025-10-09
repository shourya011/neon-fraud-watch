import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { generateRandomTransaction } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Simulator() {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    senderId: '',
    receiverId: '',
    amount: ''
  });
  const [generatedTransactions, setGeneratedTransactions] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.senderId || !formData.receiverId || !formData.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    addTransaction({
      senderId: formData.senderId,
      receiverId: formData.receiverId,
      amount: parseFloat(formData.amount)
    });

    toast.success('Transaction created successfully!');
    setFormData({ senderId: '', receiverId: '', amount: '' });
  };

  const generateRandom = () => {
    const newTransactions = Array.from({ length: 5 }, () => generateRandomTransaction());
    setGeneratedTransactions(prev => [...newTransactions, ...prev].slice(0, 20));
    
    newTransactions.forEach(tx => {
      addTransaction({
        senderId: tx.senderId,
        receiverId: tx.receiverId,
        amount: tx.amount
      });
    });

    toast.success('Generated 5 random transactions!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Transaction Simulator</h1>
        <p className="text-muted-foreground">Create and generate Bitcoin transactions for testing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manual Transaction Form */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10 glow-cyan">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Create Transaction</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="senderId">Sender ID</Label>
              <Input
                id="senderId"
                placeholder="e.g., BTC1A2X"
                value={formData.senderId}
                onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                className="mt-1 bg-input border-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="receiverId">Receiver ID</Label>
              <Input
                id="receiverId"
                placeholder="e.g., BTC8H9S"
                value={formData.receiverId}
                onChange={(e) => setFormData({ ...formData, receiverId: e.target.value })}
                className="mt-1 bg-input border-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 25000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="mt-1 bg-input border-primary/20 focus:border-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-glow"
            >
              Create Transaction
            </Button>
          </form>
        </motion.div>

        {/* Random Generator */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10 glow-magenta">
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-bold">Random Generator</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate realistic Bitcoin transactions with randomized risk factors including amount, velocity, and timing patterns.
            </p>

            <Button
              onClick={generateRandom}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground border-glow"
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate 5 Random Transactions
            </Button>

            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <h3 className="text-sm font-semibold mb-2">Generator Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount Range</p>
                  <p className="font-medium">$100 - $50,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk Variance</p>
                  <p className="font-medium">0 - 100</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Velocity</p>
                  <p className="font-medium">0-10 tx/min</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Patterns</p>
                  <p className="font-medium">4 types</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Generated Transactions */}
      {generatedTransactions.length > 0 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-xl font-bold mb-4">Recently Generated</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {generatedTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      tx.status === 'safe'
                        ? 'bg-success'
                        : tx.status === 'suspicious'
                        ? 'bg-warning'
                        : 'bg-danger'
                    } animate-pulse`}
                  />
                  <div>
                    <p className="text-sm font-mono font-medium text-primary">{tx.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.senderId} → {tx.receiverId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${tx.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs font-medium ${
                      tx.riskScore > 80
                        ? 'text-danger'
                        : tx.riskScore > 50
                        ? 'text-warning'
                        : 'text-success'
                    }`}
                  >
                    Risk: {tx.riskScore}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
