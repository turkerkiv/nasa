import React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button
    className={`px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);
