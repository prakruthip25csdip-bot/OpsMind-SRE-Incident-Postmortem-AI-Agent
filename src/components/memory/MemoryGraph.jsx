import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Database, Layers } from 'lucide-react';

export default function MemoryGraph({ memories, selectedMemory, onSelectMemory }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'preferences': return '#a855f7'; // Purple
      case 'issues': return '#f59e0b'; // Amber
      case 'solutions': return '#10b981'; // Emerald
      case 'history': return '#3b82f6'; // Blue
      case 'feedback': return '#f43f5e'; // Rose
      default: return '#06b6d4'; // Cyan
    }
  };

  // Precomputed coordinates for pleasant graph layout
  const nodePositions = [
    { x: 180, y: 140 },
    { x: 340, y: 100 },
    { x: 500, y: 130 },
    { x: 640, y: 220 },
    { x: 260, y: 280 },
    { x: 440, y: 290 },
    { x: 580, y: 350 },
    { x: 200, y: 400 },
    { x: 380, y: 440 },
  ];

  const connections = [
    [0, 1], [1, 2], [2, 3], [1, 5], [4, 5], [5, 6], [0, 4], [4, 7], [5, 8], [7, 8]
  ];

  return (
    <div className="relative w-full h-[480px] rounded-3xl border border-white/10 dark:border-white/10 light:border-slate-200 bg-[#070b14] dark:bg-[#070b14] light:bg-[#f8fafc] overflow-hidden shadow-2xl flex items-center justify-center">
      
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* SVG Canvas for Connectors and Animated Pulses */}
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Links */}
        {connections.map(([fromIdx, toIdx], i) => {
          const from = nodePositions[fromIdx] || { x: 200, y: 200 };
          const to = nodePositions[toIdx] || { x: 300, y: 300 };
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* Traveling light pulse on links */}
              <circle r="2.5" fill="#a855f7">
                <animateMotion
                  path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  dur={`${3 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Interactive Memory Nodes */}
      {memories.map((mem, idx) => {
        const pos = nodePositions[idx % nodePositions.length];
        const isSelected = selectedMemory?.id === mem.id;
        const color = getCategoryColor(mem.category);

        return (
          <motion.div
            key={mem.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            className="group cursor-pointer z-20"
            onClick={() => onSelectMemory(mem)}
            onMouseEnter={() => setHoveredNode(mem)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Outer halo ripple */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                isSelected ? 'ring-4 ring-white shadow-2xl scale-125' : 'hover:scale-115'
              }`}
              style={{
                background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0.7) 100%)`,
                boxShadow: `0 0 20px ${color}80`
              }}
            >
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>

            {/* Title pill below node */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0c101d]/90 text-slate-200 border border-white/10 shadow-lg">
                {mem.customerName.split(' ')[0]} • {mem.category}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Hover Tooltip Overlay */}
      {hoveredNode && (
        <div
          className="absolute z-30 p-3.5 rounded-2xl border border-white/15 bg-[#121829]/95 backdrop-blur-xl shadow-2xl max-w-xs pointer-events-none"
          style={{
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-mono text-purple-400 font-bold">{hoveredNode.id}</span>
            <span className="text-emerald-400 font-mono font-semibold">Similarity: {(hoveredNode.similarityScore * 100).toFixed(0)}%</span>
          </div>
          <h4 className="text-xs font-bold text-slate-100">{hoveredNode.title}</h4>
          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{hoveredNode.content}</p>
          <span className="text-[10px] text-brand-300 block mt-2">Click to inspect vector details →</span>
        </div>
      )}

      {/* Controls legend at top right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[10px] text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span>Click any node to open Hindsight Vector Inspector</span>
      </div>

    </div>
  );
}
