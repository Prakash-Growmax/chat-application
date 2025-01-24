import { cn } from "@/lib/utils";
import LucideIcon from "../Custom-UI/LucideIcon";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <LucideIcon
      name={"Loader2"}
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}
