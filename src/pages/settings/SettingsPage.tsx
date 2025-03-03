import AppContext from "@/components/context/AppContext";
import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { EditOrgDialog } from "@/components/organizations/EditOrganizationDialog";
import { CurrentPlan } from "@/components/subscription/CurrentPlan";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/organization/useOrganization";
import { useProfile } from "@/hooks/profile/useProfile";
import Main from "@/Theme/MainAnimation";
import { useContext, useState } from "react";

export function SettingsPage() {
  const { profile, loading, error } = useProfile();
  const { organization, updateOrganizationName } = useOrganization(
    profile?.organization_id
  );

  const { sideDrawerOpen } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("subscription");

  const handleUpdateOrgName = async (newName: string) => {
    await updateOrganizationName(newName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LucideIcon
          name="Loader2"
          className="h-8 w-8 animate-spin text-primary"
        />
      </div>
    );
  }

  const isOwner = profile?.role === "admin";

  return (
    <Main
      open={sideDrawerOpen}
      className={`min-h-[80vh] bg-white from-slate-50 to-white pt-12 `}
    >
      <div className="container py-4">
        <div
          className={`mx-auto max-w-6xl space-y-8 ${
            sideDrawerOpen ? "lg:max-w-5xl" : ""
          }`}
        >
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
                <LucideIcon name="CreditCard" className="h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="inline-flex items-center gap-2"
              >
                <LucideIcon name="User" className="h-4 w-4" />
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
                    <LucideIcon
                      name="Settings2"
                      className="h-5 w-5 text-primary"
                    />
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
    </Main>
  );
}

export default SettingsPage;
