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
  
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    green: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
    red: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
  };

  const disabledClasses = 'disabled:from-gray-600 disabled:to-gray-700';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses[color]} ${disabledClasses} ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </button>
  );
}
