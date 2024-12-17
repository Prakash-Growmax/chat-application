import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/lib/test-utils';
import { LoginPage } from '@/pages/auth/LoginPage';
import { sendOTP, verifyOTP } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  sendOTP: vi.fn(),
  verifyOTP: vi.fn(),
}));

describe('Authentication System', () => {
  it('handles OTP flow correctly', async () => {
    (sendOTP as any).mockResolvedValueOnce(undefined);
    (verifyOTP as any).mockResolvedValueOnce({ session: { access_token: 'test-token' } });

    render(<LoginPage />);

    // Enter email
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit email
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    // Verify OTP input appears
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/enter.*code/i)).toBeInTheDocument();
    });

    // Enter OTP
    const otpInput = screen.getByPlaceholderText(/enter.*code/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });

    // Submit OTP
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    fireEvent.click(verifyButton);

    // Verify successful login
    await waitFor(() => {
      expect(verifyOTP).toHaveBeenCalledWith('test@example.com', '123456');
    });
  });
});