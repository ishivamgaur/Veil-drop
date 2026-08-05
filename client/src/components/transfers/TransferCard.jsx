import React from 'react';

/**
 * Reusable Active Transmission Card
 * Luxury titanium design with champagne gold progress track and precise speed telemetry.
 */
export default function TransferCard({ item }) {
  const isComplete = item.progress >= 100;

  return (
    <div className="p-4 rounded-xl bg-[#070708] border border-[#22242b] transition-colors duration-200">
      <div className="flex items-center justify-between mb-2.5 text-xs">
        <span className="font-semibold text-[#f2f3f7] truncate max-w-[65%]" title={item.fileName}>
          {item.fileName}
        </span>
        <span className="text-[#888b94] text-[11px] font-mono bg-[#14161a] px-2 py-0.5 rounded border border-[#22242b]">
          {item.targetPeer}
        </span>
      </div>

      {/* Sleek Champagne Gold or Emerald Progress Track */}
      <div className="w-full h-1.5 rounded-full bg-[#16181d] overflow-hidden my-3 border border-[#22242b]">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isComplete ? 'bg-[#34d399]' : 'bg-[#ded1b6]'
          }`}
          style={{ width: `${item.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#888b94] mt-1">
        <div className="font-medium">
          {isComplete ? (
            <span className="text-[#34d399]">Complete</span>
          ) : (
            <span className="text-[#e6e7eb]">{item.progress}%</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isComplete && (
            <span className="text-[#ded1b6]">
              {item.speed}
            </span>
          )}
          <span className="text-[#71747e]">{item.sizeStr}</span>
        </div>
      </div>
    </div>
  );
}
