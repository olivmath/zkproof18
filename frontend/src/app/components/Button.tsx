import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClasses = 'w-full rounded p-4 font-mono text-sm font-medium cursor-pointer transition-all duration-200 uppercase tracking-wider';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-300 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed',
    secondary: 'bg-transparent text-white border border-white hover:bg-white hover:text-black'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 