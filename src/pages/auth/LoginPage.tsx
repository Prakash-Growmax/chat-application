import { AuthLayout } from "@/components/auth/AuthLayout";
import { EmailForm } from "@/components/auth/EmailForm";
import { OTPForm } from "@/components/auth/OTPForm";
import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";
import { useOTP } from "@/hooks/useOTP";
import { useOTPPersistence } from "@/hooks/useOTPPersistence";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LoginPage() {
  const [otp, setOtp] = useState("");
  const { user, loading: authLoading, verifyOTP: verifyAuthOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    email,
    setEmail,
    isVerifying,
    setIsVerifying,
    isLoading: persistenceLoading,
    persistOTPState,
    clearPersistedState,
    incrementAttempts,
  } = useOTPPersistence();

  const {
    loading,
    sendOTP: handleSendOTP,
    // verifyOTP: handleVerifyOTP,
    timeLeft,
    canResend,
    attemptsLeft,
  } = useOTP();

  const returnUrl = location.state?.from?.pathname || "/chat/new";

  useEffect(() => {
    if (user) {
      navigate(returnUrl, { replace: true });
    }
  }, [user, navigate, returnUrl]);

  const onSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSendOTP(email);
    if (success) {
      await persistOTPState(email);
    }
  };

  const onVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    await incrementAttempts();
    try {
      await verifyAuthOTP(email, otp);
      await clearPersistedState();
    } catch (error) {
      console.error(error)
      setOtp("");
    }
  };

  if (authLoading || persistenceLoading) {
    return null;
  }

  if (isVerifying) {
    return (
      <AuthLayout
        icon={<LucideIcon name="Mail" className="h-6 w-6" />}
        title="Check your email"
        description="We sent you a login code. Enter it below to verify."
      >
        <OTPForm
          otp={otp}
          loading={loading}
          timeLeft={timeLeft}
          canResend={canResend}
          attemptsLeft={attemptsLeft}
          onOTPChange={setOtp}
          onSubmit={onVerifyOTP}
          setIsVerifying={setIsVerifying}
          onResend={onSendOTP}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account using your email"
    >
      {authLoading || persistenceLoading ? (
        // <div className="flex justify-center items-center h-screen w-screen">
        <LoadingScreen fullScreen={false} />
      ) : (
        // </div>
        <EmailForm
          email={email}
          loading={loading}
          onEmailChange={setEmail}
          onSubmit={onSendOTP}
        />
      )}
    </AuthLayout>
  );
}

export default LoginPage;
