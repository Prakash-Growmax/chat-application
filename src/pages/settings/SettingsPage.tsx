import { EditOrgDialog } from "@/components/organizations/EditOrganizationDialog";
import { CurrentPlan } from "@/components/subscription/CurrentPlan";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/organization/useOrganization";
import { useProfile } from "@/hooks/profile/useProfile";
import { CreditCard, Loader2, Settings2, User } from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const { profile, loading, error } = useProfile();
  console.log("🚀 ~ SettingsPage ~ profile:", profile);
  const { organization, updateOrganizationName } = useOrganization(
    profile?.organization_id
  );

  const [activeTab, setActiveTab] = useState("subscription");

  const handleUpdateOrgName = async (newName: string) => {
    await updateOrganizationName(newName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isOwner = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-12 pl-24">
      <div className="container py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="text-lg text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="inline-flex justify-start h-10 rounded-md bg-muted p-1 text-muted-foreground w-full max-w-md">
              <TabsTrigger
                value="subscription"
                className="inline-flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="inline-flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subscription">
              <div className="grid gap-6 md:grid-cols-2">
                <CurrentPlan />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    <CardTitle>Profile Settings</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile?.role || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={organization?.name || "No Organization"}
                          disabled
                          className="bg-muted"
                        />
                        <EditOrgDialog
                          currentName={organization?.name}
                          isOwner={isOwner}
                          onUpdate={handleUpdateOrgName}
                        />
                      </div>
                      {isOwner && (
                        <p className="text-sm text-muted-foreground">
                          As an owner, you can edit the organization name
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Last Login</Label>
                      <Input
                        value={
                          profile?.last_login
                            ? new Date(profile.last_login)?.toLocaleString()
                            : "Never"
                        }
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tokens Remaining</Label>
                      <Input
                        value={
                          profile?.tokens_remaining?.toLocaleString() || "0"
                        }
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Usage</Label>
                      <Input
                        value={
                          profile?.current_token_usage?.toLocaleString() || "0"
                        }
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
