import React from 'react'
import { cn } from '@/utils/cn'

const Input = React.forwardRef(({ className, type = 'text', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "input-field",
        error && "border-error focus:ring-error",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input