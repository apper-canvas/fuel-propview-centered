import React from 'react'
import { cn } from '@/utils/cn'

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary transform hover:-translate-y-0.5 hover:shadow-elevation-hover",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary transform hover:-translate-y-0.5 hover:shadow-elevation-hover",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent transform hover:-translate-y-0.5 hover:shadow-elevation-hover",
    ghost: "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary focus:ring-primary transform hover:-translate-y-0.5",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error transform hover:-translate-y-0.5 hover:shadow-elevation-hover"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-xl"
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button