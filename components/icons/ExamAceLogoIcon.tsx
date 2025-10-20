import React from 'react';

// This is a new, custom-designed logo inspired by the brain/circuitry theme,
// created as a filled shape to better match the branding in the user's screenshot.
export const ExamAceLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C8.13 2 5 5.13 5 9C5 12.87 8.13 16 12 16C15.87 16 19 12.87 19 9C19 5.13 15.87 2 12 2ZM12 14C9.24 14 7 11.76 7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.76 14.76 14 12 14Z"
    />
    <path d="M12 17C10.34 17 9 18.34 9 20V22H11V20C11 19.45 11.45 19 12 19C12.55 19 13 19.45 13 20V22H15V20C15 18.34 13.66 17 12 17Z" />
    <path d="M6 16C5.45 16 5 16.45 5 17V19H7V17C7 16.45 6.55 16 6 16Z" />
    <path d="M18 16C17.45 16 17 16.45 17 17V19H19V17C19 16.45 18.55 16 18 16Z" />
  </svg>
);
