import { useTransactions } from '@/hooks/useTransactions';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AlertBanner() {
  const { latestAlert } = useTransactions();

  return (
    <AnimatePresence>
      {latestAlert && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="bg-danger/10 border-b-2 border-danger px-6 py-4 animate-pulse-glow"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-danger glow-danger" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-danger">
                ⚠️ High-Risk Transaction Detected
              </p>
              <p className="text-xs text-muted-foreground">
                Transaction ID: {latestAlert.id} | Risk Score: {latestAlert.riskScore} | 
                Amount: ${latestAlert.amount.toLocaleString()}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-danger/20 border border-danger">
              <span className="text-xs font-bold text-danger">{latestAlert.riskScore}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
