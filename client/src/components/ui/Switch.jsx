import * as React from "react";
import { cn } from "../../utils/helpers";

const Switch = React.forwardRef(({ className, checked, onCheckedChange, label, ...props }, ref) => {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer group select-none">
      {label && (
        <span className="text-xs font-medium text-[#9499a3] group-hover:text-[#e6e7eb] transition-colors">
          {label}
        </span>
      )}
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "w-10 h-5 bg-[#14161a] peer-focus:outline-none rounded-full peer transition-colors duration-200 border border-[#22242b]",
            "peer-checked:bg-[#ded1b6] peer-checked:border-[#ded1b6]",
            className
          )}
        />
        <div className="absolute left-[2px] top-[2px] bg-[#e6e7eb] rounded-full h-4 w-4 transition-transform duration-200 peer-checked:translate-x-5 peer-checked:bg-[#070708] shadow-sm" />
      </div>
    </label>
  );
});
Switch.displayName = "Switch";

export { Switch };
