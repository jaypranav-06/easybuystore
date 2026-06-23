import React from 'react';

interface LkrIconProps {
  className?: string;
}

export function LkrIcon({ className = 'w-6 h-6' }: LkrIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Stylized "Rs" or "LKR" symbol */}
      <path d="M6 4h10a4 4 0 0 1 0 8h-6" />
      <path d="M6 4v8" />
      <path d="M6 12h8" />
      <path d="M10 12l4 8" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}
