import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-[0.98]",
        secondary:
          "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 hover:text-white",
        outline:
          "border border-zinc-700/60 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
        ghost:
          "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
        danger:
          "bg-red-600/90 text-white shadow-lg shadow-red-600/20 hover:bg-red-500 active:scale-[0.98]",
        success:
          "bg-emerald-600/90 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-2.5 text-[11px]",
        lg: "h-11 px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
