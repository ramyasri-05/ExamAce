import React from 'react';

export const MedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 6.5l2.5 5 5.5 1-4 4.5 1 5.5-5-3-5 3 1-5.5-4-4.5 5.5-1z" />
    <path d="M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
    <path d="M10 13a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
  </svg>
);
