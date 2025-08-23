import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      // Use Partial<React.HTMLProps<HTMLElement>> so we can safely add `ref`
      const newProps: Partial<React.HTMLProps<HTMLElement>> = { ...props }

      if (ref) {
        newProps.ref = ref as React.Ref<HTMLElement>
      }

      if (children.props && typeof children.props === "object") {
        Object.assign(newProps, children.props)
      }

      return React.cloneElement(children, newProps)
    }

    if (React.Children.count(children) > 1) {
      React.Children.only(null)
    }

    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>
        {children}
      </span>
    )
  }
)

Slot.displayName = "Slot"

export { Slot }
