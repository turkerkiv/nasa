import React from "react";

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={`rounded-xl shadow-lg ${className || ""}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={`p-6 ${className || ""}`}>
    {children}
  </div>
);
