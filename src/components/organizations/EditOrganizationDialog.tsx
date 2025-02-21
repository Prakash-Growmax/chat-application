import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import LucideIcon from "../Custom-UI/LucideIcon";
import { useMediaQuery, useTheme } from "@mui/material";
import AppContext from "../context/AppContext";

interface EditOrgDialogProps {
  organizationId?: string;
  currentName?: string;
  isOwner?: boolean;
  onUpdate: (newName: string) => Promise<void>;
}

export function EditOrgDialog({
  currentName = "",
  isOwner = false,
  onUpdate,
}: EditOrgDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const {setSideDrawerOpen} = useContext(AppContext);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onUpdate(name.trim());
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update organization name"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) return null;
   useEffect(()=>{
      if((!isMobile || !isTab) && open){
        setSideDrawerOpen(false)
      }
      else{
        if(!isMobile || !isTab){
          setSideDrawerOpen(true)
        }
        else{
          setSideDrawerOpen(false)
        }
      
      }
  
    },[open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <LucideIcon name={"PencilLine"} className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[330px] lg:w-full md:w-full rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle>Edit Organization Name</DialogTitle>
          <DialogDescription>
            Update your organization's name. This will be visible to all team
            members.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
            />
          </div>
        </div>

        <DialogFooter>
        <div className="flex gap-x-4">
  <Button variant="outline" onClick={() => setOpen(false)}>
    Cancel
  </Button>
  <Button
    onClick={handleSubmit}
    disabled={isLoading || !name.trim() || name === currentName}
  >
    {isLoading ? (
      <>
        <LucideIcon
          name={"Loader2"}
          className="mr-2 h-4 w-4 animate-spin"
        />
        Updating...
      </>
    ) : (
      "Save Changes"
    )}
  </Button>
</div>

      
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
