import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import {
  deleteOrganization,
  getUserOrganizations,
} from "@/lib/organizations/organization-service";
import { Organization } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LucideIcon from "../Custom-UI/LucideIcon";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

export function OrganizationList() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadOrganizations = async () => {
    if (!user) return;

    try {
      const orgs = await getUserOrganizations(user.id);
      setOrganizations(orgs);
    } catch (error) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (orgId: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;

    try {
      await deleteOrganization(orgId);
      setOrganizations((orgs) => orgs.filter((org) => org.id !== orgId));
    } catch (error) {
      toast.error("Failed to delete organization");
    }
  };

  if (loading) {
    return <div className="text-center">Loading organizations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <CreateOrganizationDialog successCallback={loadOrganizations} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Card key={org.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideIcon name={"Building2"} className="h-5 w-5" />
                {org.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{org?.tokenUsage?.toLocaleString()} tokens used</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(org.id)}
                  >
                    <LucideIcon name={"Trash2"} className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {organizations.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No organizations yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  );
}
