import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LucideIcon from "../Custom-UI/LucideIcon";

interface EmailFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function EmailForm({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="h-12"
        required
        autoFocus
        disabled={loading}
      />
      <Button
        type="submit"
        className="h-12 w-full space-x-2 bg-black text-white"
        disabled={loading}
      >
        {loading ? (
          <LucideIcon name={"Loader2"} />
        ) : (
          <>
            <span>Continue with Email</span>
            <LucideIcon name={"ArrowRight"} />
          </>
        )}
      </Button>
    </form>
  );
}
