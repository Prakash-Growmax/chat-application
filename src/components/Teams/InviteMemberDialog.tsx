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

import { useProfile } from "@/hooks/profile/useProfile";
import { FC, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import AppContext from "../context/AppContext";
import { useMediaQuery, useTheme } from "@mui/material";

interface InviteMemberDialogProps {
  onInvite: (email: string, role: "admin" | "member") => Promise<void>;
}

export const InviteMemberDialog: FC<InviteMemberDialogProps> = ({
  onInvite,
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const isOwner = profile?.role === "admin";
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const {setSideDrawerOpen} = useContext(AppContext);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onInvite(email, role);
      toast("An invitation has been sent to ${email}");
      setOpen(false);
      setEmail("");
      setRole("member");
    } catch (error) {
      setIsLoading(false)
      toast(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    } finally {
      setIsLoading(false);
    }
  };
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
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        {isOwner && <Button >Invite Member</Button>}
      </DialogTrigger>
      <DialogContent className="h-[300px]  bg-white w-[330px] rounded-lg lg:w-full md:w-full">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Select
              value={role}
              onValueChange={(value: "admin" | "member") => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
