import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      rounded = 'lg',
      shadow = 'sm',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'overflow-hidden transition-all duration-200'
    
    const variantClasses = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      outlined: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
      elevated: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
    }
    
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    }
    
    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl'
    }
    
    const shadowClasses = {
      none: '',
      sm: 'shadow-soft',
      md: 'shadow-medium',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    }

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      roundedClasses[rounded],
      shadowClasses[shadow],
      hover && 'hover:shadow-md hover:border-gray-300',
      className
    )

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      title,
      subtitle,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'flex items-center justify-between',
      !children && 'px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50',
      children && 'mb-4',
      className
    )

    return (
      <div className={classes} ref={ref} {...props}>
        {title && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        )}
        {children}
        {action && <div>{action}</div>}
      </div>
    )
  }
)

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      className
    )

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50',
      className
    )

    return (
      <div className={classes} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter }
export default Card
