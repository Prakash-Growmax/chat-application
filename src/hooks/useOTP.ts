import { useState } from 'react';
import { sendOTP, verifyOTP } from '@/lib/auth/otp-service';
import { useOtpTimer } from './useOtpTimer';
import { toast } from 'sonner';

interface UseOTPReturn {
  loading: boolean;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, token: string) => Promise<{ success: boolean; session?: any }>;
  timeLeft: number;
  canResend: boolean;
  attemptsLeft: number;
}

export function useOTP(): UseOTPReturn {
  const [loading, setLoading] = useState(false);
  const { timeLeft, canResend, startTimer, attemptsLeft } = useOtpTimer();

  const handleSendOTP = async (email: string): Promise<boolean> => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    setLoading(true);
    try {
      const response = await sendOTP(email);
      
      if (response.success) {
        startTimer();
        toast.success('OTP sent to your email');
        return true;
      } else {
        toast.error(response.error || 'Failed to send OTP');
        return false;
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      toast.error('Failed to send OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (email: string, token: string) => {
    if (token.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return { success: false };
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email, token);
      
      if (response.success) {
        toast.success('Successfully verified');
        return { success: true, session: response.session };
      } else {
        toast.error(response.error || 'Invalid OTP');
        return { success: false };
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.error('Failed to verify OTP');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    timeLeft,
    canResend,
    attemptsLeft,
  };
}