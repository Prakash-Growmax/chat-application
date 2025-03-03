import { ReactNode } from "react";

// Heading Components (with pixel equivalents in comments)
export const H1 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 2.5rem = 40px, line-height: 1.2, font-weight: 700
  <h1 className={`text-h1 text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h1>
);

export const H2 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 2rem = 32px, line-height: 1.3, font-weight: 600
  <h2 className={`text-h2 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h2>
);

export const H3 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1.75rem = 28px, line-height: 1.4, font-weight: 600
  <h3 className={`text-h3 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h3>
);

export const H4 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1.5rem = 24px, line-height: 1.4, font-weight: 500
  <h4 className={`text-h4 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h4>
);

export const H5 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1.25rem = 20px, line-height: 1.5, font-weight: 500
  <h5 className={`text-h5 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h5>
);

export const H6 = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1.125rem = 18px, line-height: 1.5, font-weight: 500
  <h6 className={`text-h6 text-gray-800 dark:text-gray-200 ${className}`}>
    {children}
  </h6>
);

// Body Text Components
export const BodyLarge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1.125rem = 18px, line-height: 1.6
  <p className={`text-body-lg text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </p>
);

export const BodyText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 1rem = 16px, line-height: 1.6
  <p className={`text-body text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </p>
);

export const BodySmall = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // 0.875rem = 14px, line-height: 1.5
  <p className={`text-body-sm text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </p>
);

export const Caption = ({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
  props?: string | number | boolean;
}) => (
  // 0.75rem = 12px, line-height: 1.4
  <p
    className={`text-caption text-gray-600 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
);

// Helper Text Components with appropriate spacing
export const Label = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // Using body-sm size: 14px
  <label
    className={`text-body-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

export const ErrorText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // Using caption size: 12px
  <p className={`text-caption text-red-600 dark:text-red-400 ${className}`}>
    {children}
  </p>
);

export const HelperText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  // Using caption size: 12px
  <p className={`text-caption text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

// List Item Components
export const ListItemHeaderText = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={`text-base font-semibold text-gray-900 dark:text-gray-100 ${className}`}
  >
    {children}
  </p>
);

export const ListItemText = ({
  children,
  className = "",
  ...props
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    {...props}
    className={`text-sm font-normal text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </p>
);
