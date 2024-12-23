import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invitation } from "@/types/team";
import { FC } from "react";

interface PendingInvitesProps {
  invites: Invitation[];
  onCancel: (invitationId: string) => Promise<void>;
}

export const PendingInvites: FC<PendingInvitesProps> = ({
  invites,
  onCancel,
}) => {
  return (
    <div>
      <Table className="min-w-full divide-y divide-gray-200 mt-4">
        <TableHeader>
          <h2 className="text-xl font-semibold m-4">Pending Invitations</h2>
          <TableRow className="text-gray-500 p-2">
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>{invite.email}</TableCell>
              <TableCell className="capitalize">{invite.role}</TableCell>
              <TableCell>
                {new Date(invite.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(invite.id)}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
