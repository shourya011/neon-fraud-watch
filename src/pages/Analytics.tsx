import { useTransactions } from '@/hooks/useTransactions';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Clock, Activity } from 'lucide-react';

export default function Analytics() {
  const { transactions, stats } = useTransactions();

  // Risk score trends (last 20 transactions)
  const riskTrendData = transactions
    .slice(0, 20)
    .reverse()
    .map((tx, index) => ({
      index: index + 1,
      riskScore: tx.riskScore,
      amount: tx.amount
    }));

  // Hourly transaction volume
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const hourTransactions = transactions.filter(
      tx => new Date(tx.timestamp).getHours() === hour
    );
    return {
      hour: `${hour}:00`,
      count: hourTransactions.length,
      volume: hourTransactions.reduce((sum, tx) => sum + tx.amount, 0)
    };
  });

  // Risk distribution by amount ranges
  const amountRanges = [
    { range: '0-5K', count: transactions.filter(tx => tx.amount < 5000).length },
    { range: '5K-15K', count: transactions.filter(tx => tx.amount >= 5000 && tx.amount < 15000).length },
    { range: '15K-30K', count: transactions.filter(tx => tx.amount >= 15000 && tx.amount < 30000).length },
    { range: '30K+', count: transactions.filter(tx => tx.amount >= 30000).length }
  ];

  const insightCards = [
    {
      title: 'Peak Activity Hour',
      value: '3 PM UTC',
      icon: Clock,
      trend: '+24%'
    },
    {
      title: 'Avg Transaction Size',
      value: `$${Math.floor(stats.totalVolume / stats.total).toLocaleString()}`,
      icon: TrendingUp,
      trend: '+12%'
    },
    {
      title: 'Transactions/Min',
      value: '8.5',
      icon: Activity,
      trend: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Deep insights into transaction patterns and fraud detection</p>
      </motion.div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insightCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-primary/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 glow-cyan">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-success">↑ {card.trend}</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Score Trends */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-xl font-bold mb-4">Risk Score Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="index"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="riskScore"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                name="Risk Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Transaction Volume */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 border border-primary/20"
        >
          <h2 className="text-xl font-bold mb-4">Transaction Velocity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData.filter(d => d.count > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="hour"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="hsl(var(--primary))" name="Transaction Count" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Amount Distribution */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 border border-primary/20 lg:col-span-2"
        >
          <h2 className="text-xl font-bold mb-4">Fraud Pattern Distribution by Amount</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amountRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="range"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--secondary))" name="Transaction Count" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
