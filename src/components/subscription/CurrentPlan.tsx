import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import LucideIcon from "../Custom-UI/LucideIcon";

export function CurrentPlan() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Current Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium capitalize">{user?.plan}</p>
            <p className="text-sm text-muted-foreground">
              {user?.plan === "single"
                ? "Basic features for personal use"
                : user?.plan === "team"
                ? "Advanced features for teams"
                : "Enterprise features for large organizations"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/plans" className="gap-2">
              <span>Upgrade</span>
              <LucideIcon name={"ArrowRight"} className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
