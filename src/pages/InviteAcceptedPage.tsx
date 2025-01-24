import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { acceptInvitation } from "@/lib/team/teams-service";
import { useEffect, useState } from "react";

export function InviteAcceptedPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAcceptance = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        await acceptInvitation(user.id);
        setStatus("success");
      } catch (err) {
        console.error("Error accepting invitation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to accept invitation"
        );
        setStatus("error");
      }
    };

    handleAcceptance();
  }, []);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-6">
                <LucideIcon
                  name={"Loader2"}
                  className="h-12 w-12 animate-spin text-primary"
                />
              </div>
              <CardTitle className="text-2xl">Setting Up Your Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-muted-foreground">
                  Please wait while we configure your team access...
                </p>
              </div>
            </CardContent>
          </>
        );

      case "error":
        return (
          <>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-6">
                <LucideIcon
                  name={"XCircle"}
                  className="h-12 w-12 text-destructive"
                />
              </div>
              <CardTitle className="text-2xl text-destructive">
                Oops! Something Went Wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 text-center">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </>
        );

      case "success":
        return (
          <>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-green-100 animate-pulse" />
                  <LucideIcon
                    name={"CheckCircle2"}
                    className="relative h-12 w-12 text-green-500"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Welcome to the Team!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    Your team invitation has been accepted successfully.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You now have access to all team features and can start
                    collaborating with your team.
                  </p>
                </div>
                <Button
                  onClick={() => (window.location.href = "/chat")}
                  className="mt-4 gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Go to Chat
                  <LucideIcon name={"ArrowRight"} className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-2 transition-all duration-500 ease-in-out">
        {renderContent()}
      </Card>
    </div>
  );
}

export default InviteAcceptedPage;
