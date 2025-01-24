import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import LucideIcon from "../Custom-UI/LucideIcon";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  progress?: number;
}

export function LoadingScreen({
  message = "Loading ...",
  fullScreen = true,
  progress = 0,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-200",
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen"
          : "h-full w-full min-h-[200px]"
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="rounded-lg bg-card p-8 shadow-lg">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <LucideIcon
                name={"Building2"}
                className="h-6 w-6 animate-pulse"
              />
            </div>
          </div>
          <Progress value={progress} className="h-2 w-[200px]" />
          <p className="mt-4 text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
