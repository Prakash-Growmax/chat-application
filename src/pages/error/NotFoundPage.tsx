import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const REDIRECT_DELAY = 5000;
const suggestedLinks = [
  { title: "Chat", path: "/chat/new" },
  { title: "Settings", path: "/settings" },
  { title: "Plans", path: "/plans" },
];

function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(REDIRECT_DELAY / 1000);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirect = setTimeout(() => {
      navigate(user ? "/chat/new" : "/login", { replace: true });
    }, REDIRECT_DELAY);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, user]);

  useEffect(() => {
    if (debouncedSearch) {
      // In a real app, implement search functionality here
    }
  }, [debouncedSearch]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute animate-ping rounded-full bg-primary/10 p-16" />
        <div className="relative rounded-full bg-primary/10 p-8">
          <LucideIcon
            name="FileQuestion"
            className="h-12 w-12 animate-bounce text-primary"
          />
        </div>
      </div>

      <h1 className="mb-2 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mb-8 text-center text-muted-foreground">
        Oops! The page you're looking for seems to have wandered off.
        <br />
        Don't worry, we'll help you find your way back.
      </p>

      <div className="mb-8 flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12"
        />
        <Button size="icon" className="h-12 w-12">
          <LucideIcon name="Search" className="h-5 w-5" />
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {suggestedLinks.map((link) => (
          <Button
            key={link.path}
            variant="outline"
            onClick={() => navigate(link.path)}
            className={cn(
              "transition-colors hover:bg-primary hover:text-primary-foreground",
              !user && "pointer-events-none opacity-50"
            )}
          >
            {link.title}
          </Button>
        ))}
      </div>

      <div className="space-y-4 text-center">
        <Button
          size="lg"
          className="gap-2"
          onClick={() =>
            navigate(user ? "/chat/new" : "/login", { replace: true })
          }
        >
          {user ? (
            <>
              Go to Chat
              <LucideIcon name="Home" className="h-4 w-4" />
            </>
          ) : (
            <>
              Go to Login
              <LucideIcon name="LogIn" className="h-4 w-4" />
            </>
          )}
        </Button>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Redirecting in {countdown} seconds
          <LucideIcon name="MoveRight" className="h-4 w-4 animate-pulse" />
        </p>
      </div>
    </div>
  );
}
export default NotFoundPage;
