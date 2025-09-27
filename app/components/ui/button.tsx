import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({ 
  onClick, 
  disabled = false, 
  color = 'blue', 
  icon, 
  children, 
  className = '' 
}: ButtonProps) {

  const baseClasses = 'w-full cursor-pointer text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg';
  const disabledClasses = 'disabled:from-gray-600 disabled:to-gray-700';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 ${disabledClasses} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
}
