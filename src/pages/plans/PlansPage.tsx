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
import { Plan } from "@/types/plans";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Sparkles } from "lucide-react";

// Simple className utility to replace cn
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export function PlansPage() {
  const { user } = useAuth();
  const { upgradePlan, planId } = useSubscription();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planName: "Single" | "Team" | "Free") => {
    setLoading(planName);
    try {
      await upgradePlan(planName);
    } catch (error) {
      console.error("Subscription error:", error);
      setError("Failed to upgrade plan. Please try again.");
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
      console.error("Failed to load plans:", error);
      setError("Failed to load plans. Please refresh the page.");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container py-16">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Get started with the perfect plan for your needs. Upgrade or
              downgrade at any time.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={classNames(
                  "relative group transition-all duration-300",
                  "hover:scale-105 hover:shadow-xl",
                  hoveredCard === plan.name && "scale-105 shadow-xl",
                  plan.name === "team" &&
                    "border-primary shadow-lg ring-2 ring-primary/20"
                )}
                onMouseEnter={() => setHoveredCard(plan.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {plan.name === "team" && (
                  <div className="absolute -right-2 -top-2">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping">
                        <Sparkles className="h-8 w-8 text-primary opacity-25" />
                      </div>
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl font-bold capitalize">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold text-primary">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 group"
                      >
                        <div className="mt-1">
                          <Check className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-tight">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    className={classNames(
                      "w-full transition-all font-medium",
                      plan.name === "team"
                        ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        : "hover:border-primary hover:text-primary",
                      planId === plan.id && "opacity-75 cursor-not-allowed"
                    )}
                    variant={plan.name === "team" ? "default" : "outline"}
                    size="lg"
                    disabled={loading === plan.name || planId === plan.id}
                    onClick={() =>
                      handleSubscribe(plan.name as "Single" | "Team" | "Free")
                    }
                  >
                    {loading === plan.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : planId === plan.id ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Current Plan
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
