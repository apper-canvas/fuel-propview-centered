import React from 'react'
import { cn } from '@/utils/cn'

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white"
  }
  
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge