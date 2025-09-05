import { cva } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ocean-primary/50 focus-visible:ring-offset-2 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-ocean-primary to-ocean-secondary text-white shadow-soft hover:shadow-medium hover:from-ocean-secondary hover:to-ocean-primary",
        destructive:
          "bg-gradient-to-r from-ocean-accent to-ocean-accent-dark text-white shadow-soft hover:shadow-medium hover:from-ocean-accent-dark hover:to-ocean-accent",
        outline:
          "border-2 border-ocean-primary/30 bg-white/80 backdrop-blur-sm text-ocean-primary hover:bg-ocean-primary/10 hover:border-ocean-primary/60 shadow-soft hover:shadow-medium",
        secondary:
          "bg-gradient-to-r from-wellness-sage/20 to-wellness-mint/20 text-ocean-text backdrop-blur-sm border border-white/40 shadow-soft hover:shadow-medium hover:from-wellness-sage/30 hover:to-wellness-mint/30",
        ghost:
          "text-ocean-text hover:bg-ocean-primary/10 hover:text-ocean-primary rounded-lg",
        link: "text-ocean-primary underline-offset-4 hover:underline hover:text-ocean-secondary",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-13 rounded-xl px-8 has-[>svg]:px-6 text-base font-semibold",
        icon: "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export { buttonVariants }