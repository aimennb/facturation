import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div
    className={twMerge(
      "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className }: CardProps) => (
  <div
    className={twMerge(
      "mb-4 flex items-center justify-between gap-4",
      className,
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className }: CardProps) => (
  <h2 className={twMerge("text-lg font-semibold text-slate-900", className)}>
    {children}
  </h2>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={twMerge("space-y-4 text-sm text-slate-700", className)}>
    {children}
  </div>
);
