import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { plans } from '@/config/plans';
import { useAuth } from "@/hooks/useAuth";

export function TokenUsage() {
  const { user } = useAuth();
  // const currentPlan = plans.find((p) => p.name === user?.plan) || plans[0];
  // const usagePercentage = (user?.tokenUsage / currentPlan.tokenLimit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Token Usage</CardTitle>
      </CardHeader>
      {/* <CardContent className="space-y-4">
        <Progress value={usagePercentage} className="h-2" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {user?.tokenUsage.toLocaleString()} tokens used
          </span>
          <span className="text-muted-foreground">
            {currentPlan.tokenLimit.toLocaleString()} tokens limit
          </span>
        </div>
      </CardContent> */}
    </Card>
  );
}
