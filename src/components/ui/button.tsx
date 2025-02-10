import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = {
  outline: "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white",
  ghost: "hover:bg-white/10 text-white/70 hover:text-white",
  destructive: "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30",
  default: "bg-white/10 text-white hover:bg-white/20",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: keyof typeof buttonVariants
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium",
          "ring-offset-background transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          "disabled:pointer-events-none disabled:opacity-50",
          "h-10 px-4 py-2",
          "border border-transparent",
          buttonVariants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
