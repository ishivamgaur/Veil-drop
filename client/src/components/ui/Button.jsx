import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/helpers";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ded1b6] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] cursor-pointer select-none tracking-tight film-grain relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[#f4f5f8] text-[#08080a] hover:bg-white font-semibold shadow-sm",
        luxury:
          "bg-[#ded1b6] text-[#0a0a0c] hover:bg-[#ebdaba] font-semibold shadow-sm",
        secondary:
          "bg-[#16181d] text-[#e6e7eb] hover:bg-[#1e2027] border border-[#22242b]",
        ghost:
          "hover:bg-[#16181d] text-[#8e939f] hover:text-[#e6e7eb]",
        outline:
          "bg-[#0e1017] text-[#ded1b6] hover:bg-[#161924] border border-white/10 hover:border-[#ded1b6]/30 shadow-sm font-medium",
        destructive:
          "bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-7 text-sm",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, children, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
