import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md'
}) => {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleThemeToggle = () => {
    try {
      toggleTheme();
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return (
    <button
      onClick={handleThemeToggle}
      className={`
        ${sizeClasses[size]}
        rounded-lg
        border
        border-gray-200
        dark:border-gray-700
        bg-white
        dark:bg-gray-800
        hover:bg-gray-50
        dark:hover:bg-gray-700
        transition-all
        duration-200
        ease-in-out
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun
          size={iconSizes[size]}
          className="text-yellow-500 dark:text-yellow-400"
        />
      ) : (
        <Moon
          size={iconSizes[size]}
          className="text-gray-600 dark:text-gray-400"
        />
      )}
    </button>
  );
};

export default ThemeToggle;
