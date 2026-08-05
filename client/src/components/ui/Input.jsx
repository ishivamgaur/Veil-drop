import * as React from "react";
import { cn } from "../../utils/helpers";

const Input = React.forwardRef(({ className, type = "text", icon: Icon, rightSlot, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-cyan-500 focus-visible:ring-1 focus-visible:ring-cyan-500/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-10",
          rightSlot && "pr-10",
          className
        )}
        ref={ref}
        spellCheck="false"
        {...props}
      />
      {rightSlot && (
        <div className="absolute right-3 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
