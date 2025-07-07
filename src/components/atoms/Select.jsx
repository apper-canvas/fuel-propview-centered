import React from 'react'
import { cn } from '@/utils/cn'

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "input-field appearance-none bg-white",
        error && "border-error focus:ring-error",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = "Select"

export default Select