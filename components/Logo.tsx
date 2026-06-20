import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="#39FF14" />
      <text
        x="16"
        y="16.5"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="bold"
        fontSize="14"
        fill="black"
      >
        ds
      </text>
    </svg>
  );
}
