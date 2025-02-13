import DarkLogo from "@/assets/Logo/DarkLogo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-[100vh] bg-gradient-to-br from-background to-primary/5 flex justify-center items-center">
     <div className="relative flex items-center justify-center p-4 sm:min-w-60 md:min-w-80 lg:min-w-96">

        <Card className="w-full max-w-md backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <DarkLogo />
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
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground"></CardFooter>
        </Card>
      </div>
    </div>
  );
}
