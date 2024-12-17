import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { plans } from '@/config/plans';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { createSubscription } from '@/lib/subscription/subscription-service';

export function PlansPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (planName: string) => {
    setLoading(planName);
    try {
      const { url } = await createSubscription(planName);
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

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
                'relative overflow-hidden',
                plan.name === 'team' && 'border-primary shadow-lg'
              )}
            >
              {plan.name === 'team' && (
                <div className="absolute -right-20 top-7 rotate-45 bg-primary px-24 py-1 text-sm text-primary-foreground">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl capitalize">{plan.name}</CardTitle>
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
                  variant={plan.name === 'team' ? 'default' : 'outline'}
                  disabled={loading === plan.name || user?.plan === plan.name}
                  onClick={() => handleSubscribe(plan.name)}
                >
                  {loading === plan.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : user?.plan === plan.name ? (
                    'Current Plan'
                  ) : (
                    'Subscribe'
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