"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
            w-full px-4 py-2 border rounded-lg text-black
            focus:outline-none focus:ring-2 focus:ring-gray-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
