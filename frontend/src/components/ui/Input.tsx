import React from 'react'
import { clsx } from 'clsx'
import { Eye, EyeOff, Search } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | undefined
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
  inputSize?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = 'default',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      showPasswordToggle,
      fullWidth = false,
      type,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const baseClasses = 'block transition-colors duration-200'
    
    const variantClasses = {
      default: 'border border-gray-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500',
      filled: 'border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500',
      outlined: 'border-2 border-gray-300 bg-transparent focus:border-primary-500 focus:ring-0'
    }
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-3 py-2 text-sm rounded-lg',
      lg: 'px-4 py-3 text-base rounded-lg'
    }

    const inputClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[inputSize],
      fullWidth && 'w-full',
      leftIcon && 'pl-10',
      (rightIcon || showPasswordToggle) && 'pr-10',
      error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
      disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
      className
    )

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

    const actualType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400 h-4 w-4">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            className={inputClasses}
            ref={ref}
            type={actualType}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {showPasswordToggle && type === 'password' ? (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="text-gray-400 h-4 w-4">
                  {rightIcon}
                </div>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
