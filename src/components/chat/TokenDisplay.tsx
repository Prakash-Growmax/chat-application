import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  getRemainingTokens,
  getTokenUsagePercentage,
  PLAN_LIMITS,
  shouldShowTokenWarning,
} from "@/lib/token-manager";
import { AlertCircle } from "lucide-react";

export function TokenDisplay() {
  const { user } = useAuth();
  if (!user) return null;

  const usagePercentage = getTokenUsagePercentage(user);
  const remainingTokens = getRemainingTokens(user);
  const showWarning = shouldShowTokenWarning(user);
  const planLimit = PLAN_LIMITS[user.plan];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Token Usage
          {showWarning && <AlertCircle className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={usagePercentage} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {user?.tokenUsage?.toLocaleString()} used
          </span>
          <span className="text-muted-foreground">
            {planLimit === Infinity
              ? "Unlimited"
              : remainingTokens?.toLocaleString()}{" "}
            remaining
          </span>
        </div>
        {showWarning && (
          <p className="text-sm text-yellow-500">
            Warning: You are running low on tokens. Consider upgrading your
            plan.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
