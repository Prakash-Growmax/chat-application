import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { getAvailablePlans } from "@/lib/plans/plans-service";
import { cn } from "@/lib/utils";
import { Plan } from "@/types/plans";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function PlansPage() {
  const { user } = useAuth();
  const { upgradePlan, planId } = useSubscription();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: "Single" | "Team" | "Free") => {
    setLoading(planName);
    try {
      await upgradePlan(planName);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(null);
    }
  };

  const loadOrganizations = async () => {
    if (!user) return;

    try {
      const orgs = await getAvailablePlans();
      setPlans(orgs);
    } catch (error) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(null);
    }
  };
  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="mt-2 text-muted-foreground">
            Get started with the perfect plan for your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden",
                plan.name === "team" && "border-primary shadow-lg"
              )}
            >
              {plan.name === "team" && (
                <div className="absolute -right-20 top-7 rotate-45 bg-primary px-24 py-1 text-sm text-primary-foreground">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl capitalize">
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">${plan.price}</span>
                  /month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.name === "team" ? "default" : "outline"}
                  disabled={loading === plan.name || planId === plan.id}
                  onClick={() =>
                    handleSubscribe(plan.name as "Single" | "Team" | "Free")
                  }
                >
                  {loading === plan.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : plan?.id === planId ? (
                    "Current Plan"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
