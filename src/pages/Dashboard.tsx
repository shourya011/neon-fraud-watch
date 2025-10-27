import { useTransactions } from '@/hooks/useTransactions';
import { StatCard } from '@/components/StatCard';
import { Activity, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function Dashboard() {
  const { transactions, stats } = useTransactions();

  const riskDistribution = [
    { name: 'Safe', value: stats.safe, color: 'hsl(var(--success))' },
    { name: 'Suspicious', value: stats.suspicious, color: 'hsl(var(--warning))' },
    { name: 'Fraudulent', value: stats.fraudulent, color: 'hsl(var(--danger))' }
  ];

  const recentTransactions = transactions.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Real-Time Dashboard</h1>
        <p className="text-muted-foreground">Monitor Bitcoin transactions and detect fraud in real-time</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Transactions"
          value={stats.total}
          icon={Activity}
          trend={12}
          glowColor="cyan"
        />
        <StatCard
          title="Suspicious"
          value={stats.suspicious}
          icon={AlertTriangle}
          format="percentage"
          glowColor="magenta"
        />
        <StatCard
          title="Avg Risk Score"
          value={stats.avgRiskScore}
          icon={CheckCircle}
          glowColor="blue"
        />
        <StatCard
          title="Total Volume"
          value={Math.floor(stats.totalVolume / 1000)}
          icon={DollarSign}
          format="currency"
          trend={8}
          glowColor="cyan"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      tx.status === 'safe'
                        ? 'bg-success animate-pulse'
                        : tx.status === 'suspicious'
                        ? 'bg-warning animate-pulse'
                        : 'bg-danger animate-pulse'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{tx.id}</p>
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
      </div>
    </div>
  );
}
