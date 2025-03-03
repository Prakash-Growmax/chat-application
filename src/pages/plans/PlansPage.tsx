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
import { useContext, useEffect, useState } from "react";

import AppContext from "@/components/context/AppContext";
import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { createSubscriptionCheckoutSession } from "@/lib/stripe/stripe-service";

const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

import { useCallback } from "react";

export function PlansPage() {
  const { user } = useAuth();
  const { planId } = useSubscription();
  const { sideDrawerOpen } = useContext(AppContext);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  console.log(loading);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const loadOrganizations = useCallback(async () => {
    if (!user?.id) return;
  
    try {
      const cachedPlans = localStorage.getItem("plans");
      if (cachedPlans) {
        setPlans(JSON.parse(cachedPlans));
        return;
      }
  
      const orgs = await getAvailablePlans();
      setPlans(orgs);
      localStorage.setItem("plans", JSON.stringify(orgs)); // Cache plans
    } catch (error) {
      console.error("Failed to load plans:", error);
      setError("Failed to load plans. Please refresh the page.");
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (user?.id) {
      loadOrganizations();
    }
  
    // Disable scrolling
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; // Re-enable scrolling
    };
  }, [user?.id, loadOrganizations]);

  const handleSubscribe = async (plan: any) => {

    if (!user?.id) {
      return null;
    }
    createSubscriptionCheckoutSession(
      Number(plan?.price),
      user?.email,
      user?.id
    );
  };
 
  return (
    <div className="fixed inset-0 overflow-y-auto bg-white from-slate-50 to-white pt-96 lg:pt-0 md:pt-40">
      <div className="container py-16 h-full flex flex-col justify-center">
        <div
          className={`mx-auto max-w-4xl space-y-12 ${
            sideDrawerOpen ? "lg:max-w-3xl lg:pt-12" : ""
          }`}
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-[#0A0A0A]">
              Choose Your Plan
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
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
            {plans?.map((plan) => (
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
                          <LucideIcon
                            name="Check"
                            className="h-4 w-4 text-primary group-hover:scale-110 transition-transform"
                          />
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
                      <LucideIcon
                        name="Loader2"
                        className="h-4 w-4 animate-spin"
                      />
                    ) : planId === plan.id ? (
                      <span className="flex items-center gap-2">
                        <LucideIcon name="Check" className="h-4 w-4" />
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

