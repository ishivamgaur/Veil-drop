import React from 'react';
import { CheckCircle2, Zap, FileText } from 'lucide-react';

/**
 * Reusable Drop History Row Component
 * Renders individual completed file transfer records with status indicators and formatting.
 */
export default function HistoryRow({ item }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200 group">
      <div className="flex items-center gap-3 truncate max-w-[75%]">
        <div className="w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="truncate">
          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors" title={item.fileName}>
            {item.fileName}
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>Beamed to <strong className="text-slate-300">{item.peerName}</strong></span>
            <span>•</span>
            <span className="text-slate-500">{item.sizeStr}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium tracking-wide uppercase">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>Sent</span>
      </div>
    </div>
  );
}
