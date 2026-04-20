import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'full'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      rounded = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center font-medium'
    
    const variantClasses = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      error: 'bg-error-100 text-error-800',
      info: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    }
    
    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded',
      full: 'rounded-full'
    }

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      roundedClasses[rounded],
      className
    )

    return (
      <span className={classes} ref={ref} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
