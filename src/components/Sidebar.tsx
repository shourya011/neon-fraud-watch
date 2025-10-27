import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Network, BarChart3, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: List, label: 'Transactions' },
  { to: '/graph', icon: Network, label: 'Graph View' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/simulator', icon: Zap, label: 'Simulator' },
];

export function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-card border-r border-primary/20 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="h-10 w-10 text-primary glow-cyan" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">BTC Fraud</h1>
            <p className="text-xs text-muted-foreground">Detection System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`h-5 w-5 ${isActive ? 'glow-cyan' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary/20">
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">System Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">Online</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
