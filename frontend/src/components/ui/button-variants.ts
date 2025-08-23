import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ocean-primary text-white hover:bg-ocean-primary-dark",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-ocean-primary text-ocean-primary hover:bg-ocean-primary hover:text-white",
        secondary:
          "bg-ocean-secondary text-white hover:bg-ocean-secondary-dark",
        ghost: "hover:bg-ocean-background hover:text-ocean-text",
        link: "text-ocean-primary underline-offset-4 hover:underline",
        save: "bg-green-600 text-white hover:bg-green-700 font-semibold shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)