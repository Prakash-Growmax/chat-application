import DarkLogo from "@/assets/Logo/DarkLogo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({
  children,
  icon,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <DarkLogo/>
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              {title}
            </CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
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
