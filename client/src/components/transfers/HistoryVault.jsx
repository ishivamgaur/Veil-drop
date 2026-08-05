import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import HistoryRow from './HistoryRow';

/**
 * Drop Vault History Monitor
 * Swiss architectural log of completed file transfers without icon spam.
 */
export default function HistoryVault({ historyVault, clearHistory }) {
  return (
    <Card className="border-[#22242b] bg-[#101114] shadow-none">
      <CardHeader className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#22242b]">
        <CardTitle className="text-base font-bold text-[#f2f3f7]">
          Transmission Log
        </CardTitle>

        {historyVault.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-7 px-3 text-xs text-[#888b94] hover:text-white"
            title="Clear transmission records"
          >
            Clear Log
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
          {historyVault.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-xl border border-dashed border-[#22242b] bg-[#070708]/30 text-[#71747e]">
              <span className="text-xs">No completed transfer sessions recorded.</span>
            </div>
          ) : (
            historyVault.map((item) => (
              <HistoryRow key={item.id} item={item} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
