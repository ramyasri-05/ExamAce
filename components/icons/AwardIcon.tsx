import React from 'react';

export const AwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="m15.477 12.89 1.523 9.11L12 19l-5 3 1.523-9.11" />
    <circle cx="12" cy="8" r="6" />
  </svg>
);
