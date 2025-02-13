import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import LucideIcon from "../Custom-UI/LucideIcon";

interface OTPFormProps {
  otp: string;
  loading: boolean;
  timeLeft: number;
  canResend: boolean;
  attemptsLeft: number;
  setIsVerifying:(verify: boolean) => void;
  onOTPChange: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onResend: () => Promise<void>;
}

export function OTPForm({
  otp,
  loading,
  timeLeft,
  canResend,
  attemptsLeft,
  onOTPChange,
  onSubmit,
  setIsVerifying,
  onResend,
}: OTPFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        maxLength={6}
        placeholder="Enter 6-digit code"
        value={otp}
        onChange={(e) =>
          onOTPChange(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        className="h-12 text-center text-lg tracking-widest"
        required
        autoComplete="one-time-code"
        disabled={loading}
        autoFocus
      />
      <p className="text-center text-sm text-muted-foreground">
        {timeLeft > 0
          ? `Resend available in ${timeLeft}s`
          : canResend
          ? `${attemptsLeft} attempts remaining`
          : "Maximum resend attempts reached"}
      </p>
      <Button
        type="submit"
        className={cn("h-12 w-full space-x-2 bg-black text-white")}
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <LucideIcon name={"Loader2"} className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Verify Code</span>
            <LucideIcon name={"ArrowRight"} className="h-4 w-4" />
          </>
        )}
      </Button>
    
      <div className="flex items-center justify-center">
  <Button
    type="button"
    className="flex items-center justify-center"
    onClick={()=>{setIsVerifying(false)}}
  >
    Back
  </Button>
</div>



      <Button
        type="button"
        variant="ghost"
        className="w-full space-x-2"
        onClick={onResend}
        disabled={!canResend || loading || timeLeft > 0}
      >
        {loading ? (
          <LucideIcon name={"Loader2"} className="h-4 w-4" />
        ) : (
          <>
            <LucideIcon name={"RefreshCw"} className="h-4 w-4" />
            <span className="cursor-pointer">Resend Code</span>
          </>
        )}
      </Button>
       
    </form>
  );
}
