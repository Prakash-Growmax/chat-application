import { Progress } from "@/components/ui/progress";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { cn } from "@/lib/utils";
import LucideIcon from "../Custom-UI/LucideIcon";

interface GlobalLoadingIndicatorProps {
  fullScreen?: boolean;
}

export function GlobalLoadingIndicator({
  fullScreen = true,
}: GlobalLoadingIndicatorProps) {
  const { isLoading, message, progress, error } = useGlobalLoading();

  if (!isLoading && !error) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background/80 backdrop-blur-sm",
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen"
          : "h-full w-full min-h-[200px]"
      )}
    >
      <div className="rounded-lg bg-card p-8 shadow-lg w-full max-w-md mx-4">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <LucideIcon
                name={"Building2"}
                className="h-6 w-6 animate-pulse"
              />
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{message}</p>
            {progress > 0 && progress < 100 && (
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md p-3">
              <p>{error.message}</p>
              <p className="text-xs mt-1">Please try refreshing the page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
