import React from 'react';

export const ScaleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 16.5l-4-4-4 4" />
    <path d="M12 4v8.5" />
    <path d="M22 12h-5" />
    <path d="M7 12H2" />
    <path d="M12 22a8 8 0 0 0 8-8" />
    <path d="M12 22a8 8 0 0 1-8-8" />
  </svg>
);