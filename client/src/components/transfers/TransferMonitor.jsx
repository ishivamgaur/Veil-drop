import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import TransferCard from './TransferCard';

/**
 * Active Transmissions Monitor Panel
 * Swiss minimalist telemetry monitoring without icon clutter or gradient bars.
 */
export default function TransferMonitor({ activeTransfers }) {
  return (
    <Card className="border-[#22242b] bg-[#101114] shadow-none">
      <CardHeader className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#22242b]">
        <CardTitle className="text-base font-bold text-[#f2f3f7]">
          Active Streams
        </CardTitle>
        <Badge variant={activeTransfers.length > 0 ? "luxury" : "neutral"}>
          {activeTransfers.length} Active
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
          {activeTransfers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-[#22242b] bg-[#070708]/40">
              <p className="text-xs font-semibold text-[#888b94]">No active data transfers</p>
              <span className="text-[11px] text-[#71747e] mt-1">Initiate a transfer to view real-time throughput metrics.</span>
            </div>
          ) : (
            activeTransfers.map((item) => (
              <TransferCard key={item.id} item={item} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
