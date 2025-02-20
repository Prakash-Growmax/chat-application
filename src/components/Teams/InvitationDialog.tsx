import { supabase } from "@/lib/supabase";
import { inviteTeamMember } from "@/lib/team/teams-service";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectItem } from "../ui/select";

export const InviteDialog = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const handleInvite = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user?.user) return;

      const { data: org_id } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("email", user.user.email)
        .single();

      if (!org_id) return;

      await inviteTeamMember(user.user.id, org_id.organization_id, email, role);
      toast.success("Invitation sent successfully!");
    } catch (error) {
      toast.error("Failed to send invitation");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>Invite Team Member</DialogTrigger>
      <DialogContent>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </Select>
        <Button onClick={handleInvite}>Send Invitation</Button>
      </DialogContent>
    </Dialog>
  );
};
