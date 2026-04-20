import React from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-soft',
      warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-soft',
      danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-soft',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    )

    const renderIcon = () => {
      if (loading) {
        return <Loader2 className="h-4 w-4 animate-spin" />
      }
      return icon
    }

    const iconElement = renderIcon()
    const shouldShowIcon = iconElement && !loading

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {!loading && shouldShowIcon && iconPosition === 'left' && (
          <span className="mr-2">{iconElement}</span>
        )}
        {children}
        {!loading && shouldShowIcon && iconPosition === 'right' && (
          <span className="ml-2">{iconElement}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
