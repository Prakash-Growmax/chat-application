import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OTPFormProps {
  otp: string;
  loading: boolean;
  timeLeft: number;
  canResend: boolean;
  attemptsLeft: number;
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
        onChange={(e) => onOTPChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
          : 'Maximum resend attempts reached'}
      </p>
      <Button
        type="submit"
        className={cn('h-12 w-full space-x-2 bg-black text-white')}
        disabled={loading || otp.length !== 6}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Verify Code</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full space-x-2"
        onClick={onResend}
        disabled={!canResend || loading || timeLeft > 0}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            <span className='cursor-pointer'>Resend Code</span>
          </>
        )}
      </Button>
    </form>
  );
}