import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost"; size?: "sm" | "lg" | "icon" };
export function Button({ className = "", variant = "default", size, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring";
  const variants = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200",
    ghost: "bg-transparent hover:bg-gray-100"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
    icon: "p-2"
  };
  const sizeCls = size ? sizes[size] : "";
  return <button className={`${base} ${variants[variant]} ${sizeCls} ${className}`} {...props} />;
}
