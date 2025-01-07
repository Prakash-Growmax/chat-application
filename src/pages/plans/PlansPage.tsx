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
import { useContext, useEffect, useState } from "react";

import AppContext from "@/components/context/AppContext";
import { createSubscriptionCheckoutSession } from "@/lib/stripe/stripe-service";

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export function PlansPage() {
  const { user } = useAuth();
  const { upgradePlan, planId } = useSubscription();
  console.log("🚀 ~ PlansPage ~ planId:", planId);
  const { open } = useContext(AppContext);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: any) => {
    if (!user?.id) {
      return null;
    }
    createSubscriptionCheckoutSession(Number(plan?.price), user?.id);
    // setLoading(plan?.name);
    // try {
    //   await upgradePlan(plan.name);
    // } catch (error) {
    //   console.error("Subscription error:", error);
    //   setError("Failed to upgrade plan. Please try again.");
    // } finally {
    //   setLoading(null);
    // }
  };

  const loadOrganizations = async () => {
    if (!user) return;

    try {
      const orgs = await getAvailablePlans();
      setPlans(orgs);
    } catch (error) {
      console.error("Failed to load plans:", error);
      setError("Failed to load plans. Please refresh the page.");
    }
  };

  useEffect(() => {
    loadOrganizations();
    // Disable scrolling
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable scrolling on cleanup
      document.body.style.overflow = "";
    };
  }, [user]);

  return (
    <div className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-slate-50 to-white pl-24">
      <div className="container py-16 h-full flex flex-col justify-center">
        <div
          className={`mx-auto max-w-4xl space-y-12 ${
            open ? "lg:max-w-3xl md:pl-16 lg:pt-12" : ""
          }`}
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-[#0A0A0A]">
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

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 mx-auto justify-center">
            {" "}
            {/* Centering added here */}{" "}
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
                      planId === plan.id && "opacity-75"
                    )}
                    variant={plan.name === "team" ? "default" : "outline"}
                    size="lg"
                    disabled={loading === plan.name}
                    onClick={() => handleSubscribe(plan)}
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
