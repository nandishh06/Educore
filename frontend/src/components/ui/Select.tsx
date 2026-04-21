import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  placeholder?: string;
  fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({ 
  label, 
  error, 
  options, 
  value, 
  placeholder, 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            // Handle change event
          }}
          className={`
            block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${fullWidth ? 'w-full' : ''}
            ${className}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {value && (
          <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-2">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
