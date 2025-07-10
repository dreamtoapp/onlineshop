import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import debounce from "debounce" // Lightweight debounce/throttle

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg border-none hover:from-primary/80 hover:to-secondary/80 hover:bg-gradient-to-l hover:scale-[1.03] active:scale-95 focus-visible:ring-2 focus-visible:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /**
   * If set, throttles the onClick handler to fire at most once per X ms.
   * Uses debounce package with immediate=true for throttle behavior.
   */
  throttle?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, throttle, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    // Throttle onClick if throttle prop is set
    const throttledOnClick = React.useMemo(() => {
      if (!throttle || !onClick) return onClick
      // Use debounce as throttle (immediate: true)
      return debounce((...args: [React.MouseEvent<HTMLButtonElement>]) => {
        console.log('Button throttled onClick fired');
        onClick(...args);
      }, throttle, { immediate: true })
    }, [onClick, throttle])
    // console.log('Button rendered', { throttle, hasOnClick: !!onClick });
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={throttledOnClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
