import React from 'react';
import { cn } from '../../utils/helpers';

export function Badge({ children, variant = 'neutral', dot = false, pulse = false, className, ...props }) {
  const variants = {
    neutral: "bg-[#14161a] border-[#22242b] text-[#9499a3]",
    luxury: "bg-[#161512] border-[#2d291e] text-[#ded1b6]",
    active: "bg-[#101915] border-[#1b2d24] text-[#34d399]",
    warning: "bg-[#1f1610] border-[#362419] text-[#fbbf24]"
  };

  const dotColors = {
    neutral: "bg-[#71717a]",
    luxury: "bg-[#ded1b6]",
    active: "bg-[#10b981]",
    warning: "bg-[#f59e0b]"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md border text-[11px] font-mono tracking-wide uppercase select-none transition-colors",
        variants[variant] || variants.neutral,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[variant])}></span>
          )}
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])}></span>
        </span>
      )}
      {children}
    </span>
  );
}
