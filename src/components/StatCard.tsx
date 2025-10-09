import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  format?: 'number' | 'currency' | 'percentage';
  glowColor?: 'cyan' | 'blue' | 'magenta';
}

export function StatCard({ title, value, icon: Icon, trend, format = 'number', glowColor = 'cyan' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  const glowClass = glowColor === 'cyan' ? 'glow-cyan' : glowColor === 'blue' ? 'glow-blue' : 'glow-magenta';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-card rounded-xl p-6 border border-primary/20 overflow-hidden group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold mt-2 text-foreground">{formatValue(displayValue)}</h3>
          </div>
          <div className={`p-3 rounded-lg bg-primary/10 ${glowClass}`}>
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            <span className={`text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
