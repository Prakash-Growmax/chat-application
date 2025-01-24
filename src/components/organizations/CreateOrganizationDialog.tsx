import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { createOrganization } from "@/lib/organizations/organization-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import LucideIcon from "../Custom-UI/LucideIcon";

const schema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
});

type FormData = z.infer<typeof schema>;

export function CreateOrganizationDialog({
  successCallback,
}: {
  successCallback: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);

    try {
      await createOrganization(data.name, user.id);
      toast.success("Organization created successfully");
      setOpen(false);
      successCallback();
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create organization");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <LucideIcon name={"Building2"} className="h-4 w-4" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter organization name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <LucideIcon name={"Loader2"} className="h-4 w-4 animate-spin" />
            ) : (
              "Create Organization12"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
