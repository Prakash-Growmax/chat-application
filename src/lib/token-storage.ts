import { toast } from 'sonner';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const OTP_STATE_KEY = 'otp_verification_state';

export async function clearAllTokens(): Promise<void> {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(OTP_STATE_KEY);
    sessionStorage.clear();
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('token') || key.includes('auth') || key.includes('user')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing tokens:', error);
    toast.error('Failed to clear tokens');
    throw error;
  }
}

export async function resetApplication(): Promise<void> {
  try {
    await clearAllTokens();
    window.location.href = '/';
  } catch (error) {
    console.error('Error resetting application:', error);
    toast.error('Failed to reset application');
    throw error;
  }
}