import { Building2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, icon, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 pl-16">
      <div className="absolute inset-0 bg-white" />
      <div className="container relative flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                {icon || <Building2 className="h-6 w-6" />}
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            {/* <p>
              By continuing, you agree to our{' '}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </a>
              .
            </p> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}