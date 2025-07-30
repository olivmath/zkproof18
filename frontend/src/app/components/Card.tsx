import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 rounded p-6 transition-all duration-200 hover:border-white hover:shadow-lg hover:shadow-white/10 ${className}`}>
      {children}
    </div>
  );
}; 