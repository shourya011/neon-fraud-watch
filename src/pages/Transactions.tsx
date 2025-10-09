import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Transactions() {
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | 'safe' | 'suspicious' | 'fraudulent'>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.senderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.receiverId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = riskFilter === 'all' || tx.status === riskFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Transaction Monitor</h1>
        <p className="text-muted-foreground">View and analyze all Bitcoin transactions</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, Sender, or Receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'safe', 'suspicious', 'fraudulent'].map((filter) => (
            <button
              key={filter}
              onClick={() => setRiskFilter(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                riskFilter === filter
                  ? 'bg-primary text-primary-foreground border-glow'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-primary/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Sender → Receiver
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-primary">{tx.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium">{tx.senderId}</span>
                        <span className="mx-2 text-muted-foreground">→</span>
                        <span className="font-medium">{tx.receiverId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold">${tx.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            tx.status === 'safe'
                              ? 'bg-success'
                              : tx.status === 'suspicious'
                              ? 'bg-warning'
                              : 'bg-danger'
                          } animate-pulse`}
                        />
                        <span
                          className={`text-sm font-bold ${
                            tx.riskScore > 80
                              ? 'text-danger'
                              : tx.riskScore > 50
                              ? 'text-warning'
                              : 'text-success'
                          }`}
                        >
                          {tx.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                        className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        {expandedId === tx.id ? (
                          <ChevronUp className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expandedId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-primary/20 overflow-hidden"
            >
              {filteredTransactions
                .filter(tx => tx.id === expandedId)
                .map(tx => (
                  <div key={tx.id} className="p-6 bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Reason</p>
                        <p className="text-sm font-medium">{tx.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Status</p>
                        <p className="text-sm font-medium capitalize">{tx.status}</p>
                      </div>
                      {tx.features && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase mb-1">Velocity</p>
                            <p className="text-sm font-medium">{tx.features.velocity} tx/min</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase mb-1">Time Pattern</p>
                            <p className="text-sm font-medium capitalize">{tx.features.timePattern}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {filteredTransactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No transactions found matching your filters.</p>
        </motion.div>
      )}
    </div>
  );
}
