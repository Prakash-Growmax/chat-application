import { supabase } from "../supabase";

export interface OTPResponse {
  success: boolean;
  error?: string;
  session?: any;
}

export async function sendOTP(email: string): Promise<OTPResponse> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        channel: "email",
        type: "otp",
      },
    });

    if (error) {
      console.error("OTP Send Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("OTP Service Error:", error);
    return {
      success: false,
      error: "Failed to send OTP. Please try again.",
    };
  }
}

export async function verifyOTP(
  email: string,
  token: string
): Promise<OTPResponse> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.error("OTP Verification Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error) {
    console.error("OTP Verification Service Error:", error);
    return {
      success: false,
      error: "Failed to verify OTP. Please try again.",
    };
  }
}
