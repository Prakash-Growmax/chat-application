import { z } from 'zod';

const OTPStateSchema = z.object({
  email: z.string().email(),
  timestamp: z.number(),
  attempts: z.number(),
  lastRequestTime: z.number(),
});

type OTPState = z.infer<typeof OTPStateSchema>;

const OTP_STATE_KEY = 'otp_verification_state';
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

export async function saveOTPState(email: string): Promise<void> {
  const state: OTPState = {
    email,
    timestamp: Date.now(),
    attempts: 0,
    lastRequestTime: Date.now(),
  };

  try {
    localStorage.setItem(OTP_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save OTP state:', error);
  }
}

export async function getOTPState(): Promise<OTPState | null> {
  try {
    const stateStr = localStorage.getItem(OTP_STATE_KEY);
    if (!stateStr) return null;

    const state = OTPStateSchema.parse(JSON.parse(stateStr));
    
    // Check if OTP has expired
    if (Date.now() - state.timestamp > OTP_EXPIRY_TIME) {
      await clearOTPState();
      return null;
    }

    return state;
  } catch (error) {
    console.error('Failed to get OTP state:', error);
    return null;
  }
}

export async function updateOTPAttempts(): Promise<void> {
  try {
    const state = await getOTPState();
    if (!state) return;

    const updatedState: OTPState = {
      ...state,
      attempts: state.attempts + 1,
    };

    localStorage.setItem(OTP_STATE_KEY, JSON.stringify(updatedState));
  } catch (error) {
    console.error('Failed to update OTP attempts:', error);
  }
}

export async function clearOTPState(): Promise<void> {
  try {
    localStorage.removeItem(OTP_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear OTP state:', error);
  }
}