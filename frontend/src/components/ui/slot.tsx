import * as React from "react"

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      // Create a new props object that merges our props with the child's props
      const newProps: Record<string, any> = { ...props }
      
      // Add the ref to the new props
      if (ref) {
        newProps.ref = ref
      }
      
      // Merge with existing child props, giving precedence to child props
      if (children.props && typeof children.props === 'object') {
        Object.assign(newProps, children.props)
      }
      
      return React.cloneElement(children, newProps)
    }
    
    if (React.Children.count(children) > 1) {
      React.Children.only(null)
    }
    
    return <span ref={ref as React.Ref<HTMLSpanElement>} {...props}>{children}</span>
  }
)
Slot.displayName = "Slot"

export { Slot }