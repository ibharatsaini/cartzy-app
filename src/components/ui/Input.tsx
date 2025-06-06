import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className, ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            "px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400",
            "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300",
            fullWidth ? 'w-full' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;