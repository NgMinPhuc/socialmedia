import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  className = '',
  error,
  label,
  id,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        ref={ref}
        id={id}
        className={twMerge(`
          block w-full rounded-lg border
          px-3 py-2 text-gray-900 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `)}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
