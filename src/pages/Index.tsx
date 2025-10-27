import { useMemo } from 'react';
import { generateSimpleTransactions } from '@/lib/mockData';
import type { SimpleTransaction } from '@/types/transaction';

const Index = () => {
  const transactions: SimpleTransaction[] = useMemo(() => generateSimpleTransactions(25), []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Transactions (sample)</h1>
      <div className="overflow-auto rounded-md border">
        <table className="w-full table-auto text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Tx ID</th>
              <th className="px-3 py-2 text-left">Sender</th>
              <th className="px-3 py-2 text-left">Receiver</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-right">Outputs</th>
              <th className="px-3 py-2 text-right">Time Δ (s)</th>
              <th className="px-3 py-2 text-right">Velocity</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.tx_id} className="border-t even:bg-muted/50">
                <td className="px-3 py-2 font-mono text-xs">{t.tx_id}</td>
                <td className="px-3 py-2">{t.sender}</td>
                <td className="px-3 py-2">{t.receiver}</td>
                <td className="px-3 py-2 text-right">{t.amount.toLocaleString()}</td>
                <td className="px-3 py-2">{new Date(t.timestamp).toLocaleString()}</td>
                <td className="px-3 py-2 text-right">{t.num_outputs}</td>
                <td className="px-3 py-2 text-right">{t.time_diff}</td>
                <td className="px-3 py-2 text-right">{t.velocity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
