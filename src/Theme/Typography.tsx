import { ReactNode } from "react";

export const H1 = ({ children, className = "" }) => (
  <h1 className={`text-h1 text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h1>
);

export const H2 = ({ children, className = "" }) => (
  <h2 className={`text-h2 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h2>
);

export const BodyText = ({ children, className = "" }) => (
  <p className={`text-body text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </p>
);

export const ListItemHeaderText: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p className={`font-[600] text-[12.5px] text-custom-color ${className}`}>
    {children}
  </p>
);

export const ListItemText: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p className={`font-[400] text-[11px]  ${className}`}>{children}</p>
);
