import { useTokenUsage } from '@/hooks/useTokenUsage';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export function TokenUsageDisplay() {
  const { loading, usage, history, isLow } = useTokenUsage();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Token Usage
          {isLow && <AlertCircle className="h-4 w-4 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={usage.percentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{usage.used.toLocaleString()} used</span>
            <span>
              {usage.limit === Infinity 
                ? 'Unlimited' 
                : `${usage.limit.toLocaleString()} total`}
            </span>
          </div>
        </div>

        {history.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            <div className="space-y-1">
              {history.map((log, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span>{log.action}</span>
                  <div className="flex gap-2">
                    <span>{log.tokens} tokens</span>
                    <span>{format(log.timestamp, 'HH:mm')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isLow && (
          <p className="text-sm text-yellow-500">
            Warning: You are running low on tokens. Consider upgrading your plan.
          </p>
        )}
      </CardContent>
    </Card>
  );
}