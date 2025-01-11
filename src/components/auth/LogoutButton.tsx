import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/Theme/Typography";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const { signOut } = useAuth();
  return (
    <div
      className="flex items-center gap-2 w-full hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer"
      onClick={signOut}
    >
      <LogOut size={16} color="#64748B" />
      <Label>Logout</Label>
    </div>
  );
}

export default LogoutButton;
