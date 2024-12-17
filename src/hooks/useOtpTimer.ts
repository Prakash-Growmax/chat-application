import { useState, useEffect } from 'react';

const OTP_TIMEOUT = 60; // 60 seconds
const MAX_RESEND_ATTEMPTS = 3;

export function useOtpTimer() {
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(OTP_TIMEOUT);
    setIsActive(true);
    setResendAttempts((prev) => prev + 1);
  };

  const canResend = !isActive && resendAttempts < MAX_RESEND_ATTEMPTS;

  return {
    timeLeft,
    canResend,
    startTimer,
    attemptsLeft: MAX_RESEND_ATTEMPTS - resendAttempts,
  };
}