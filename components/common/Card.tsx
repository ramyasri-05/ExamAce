import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const combinedClassName = `bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 ${className}`;
  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
};

export default Card;