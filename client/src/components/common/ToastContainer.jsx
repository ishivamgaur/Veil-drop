import React from 'react';
import { Sparkles, X, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

/**
 * Floating Animated Snackbar Toast Container
 * Renders interactive status feedback notifications with custom Lucide symbology.
 */
export default function ToastContainer({ toasts, removeToast }) {
  const getIcon = (msg) => {
    if (msg.includes('🔒')) return <Lock className="w-4 h-4 text-cyan-400 shrink-0" />;
    if (msg.includes('⚠️')) return <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />;
    if (msg.includes('✓') || msg.includes('Sent') || msg.includes('Beamed')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    return <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 md:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl glass-panel border border-cyan-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95 group animate-in slide-in-from-bottom-5 fade-in duration-300",
            toast.message.includes('⚠️') && "border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900"
          )}
          title="Click to dismiss notification"
        >
          <div className="flex items-center gap-3 text-xs font-medium text-slate-100 leading-snug">
            <div className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-sm">
              {getIcon(toast.message)}
            </div>
            <span>{toast.message.replace(/^[👋🔒⚠️🔄📋⚡]\s*/, '')}</span>
          </div>

          <button className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
