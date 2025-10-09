import { useEffect, useRef } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { motion } from 'framer-motion';
import cytoscape from 'cytoscape';

export default function GraphView() {
  const { transactions } = useTransactions();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create unique nodes from transactions
    const nodes = new Map<string, { id: string; riskScore: number }>();
    transactions.forEach(tx => {
      if (!nodes.has(tx.senderId)) {
        nodes.set(tx.senderId, { id: tx.senderId, riskScore: tx.riskScore });
      }
      if (!nodes.has(tx.receiverId)) {
        nodes.set(tx.receiverId, { id: tx.receiverId, riskScore: tx.riskScore });
      }
    });

    // Create edges from transactions
    const edges = transactions.slice(0, 50).map(tx => ({
      id: tx.id,
      source: tx.senderId,
      target: tx.receiverId,
      riskScore: tx.riskScore,
      amount: tx.amount
    }));

    const elements = [
      ...Array.from(nodes.values()).map(node => ({
        data: { id: node.id, riskScore: node.riskScore }
      })),
      ...edges.map(edge => ({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          riskScore: edge.riskScore,
          amount: edge.amount
        }
      }))
    ];

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => {
              const risk = ele.data('riskScore');
              if (risk > 80) return '#ef4444';
              if (risk > 50) return '#eab308';
              return '#22c55e';
            },
            'width': '40px',
            'height': '40px',
            'label': 'data(id)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'text-outline-color': '#000',
            'text-outline-width': 2
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': (ele: any) => {
              const risk = ele.data('riskScore');
              if (risk > 80) return '#ef444480';
              if (risk > 50) return '#eab30880';
              return '#22c55e80';
            },
            'target-arrow-color': (ele: any) => {
              const risk = ele.data('riskScore');
              if (risk > 80) return '#ef4444';
              if (risk > 50) return '#eab308';
              return '#22c55e';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 1000,
        idealEdgeLength: 100,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 30,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
      }
    });

    // Add tooltips
    cyRef.current.on('tap', 'node', (event) => {
      const node = event.target;
      console.log('Node:', node.data());
    });

    cyRef.current.on('tap', 'edge', (event) => {
      const edge = event.target;
      console.log('Edge:', edge.data());
    });

    return () => {
      cyRef.current?.destroy();
    };
  }, [transactions]);

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gradient mb-2">Transaction Network</h1>
        <p className="text-muted-foreground">Interactive visualization of Bitcoin transaction flow</p>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex gap-4 bg-card p-4 rounded-xl border border-primary/20"
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm">Safe (0-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning" />
          <span className="text-sm">Suspicious (51-80)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-danger" />
          <span className="text-sm">Fraudulent (81-100)</span>
        </div>
      </motion.div>

      {/* Graph Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-primary/20 overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div ref={containerRef} className="w-full h-full" />
      </motion.div>
    </div>
  );
}
