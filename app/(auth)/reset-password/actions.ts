'use server';

import { z } from 'zod';
import { verifyPasswordResetToken, resetPasswordWithToken } from '@/lib/db/queries';

export interface ResetPasswordActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data' | 'invalid_token' | 'token_expired';
}

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPassword = async (
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> => {
  try {
    const validatedData = resetPasswordSchema.parse({
      email: formData.get('email'),
      token: formData.get('token'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });

    // Verify token
    const verificationResult = await verifyPasswordResetToken(
      validatedData.email,
      validatedData.token
    );

    if (!verificationResult.isValid) {
      if (verificationResult.reason === 'token_expired') {
        return { status: 'token_expired' };
      }
      return { status: 'invalid_token' };
    }

    // Reset password
    await resetPasswordWithToken(validatedData.email, validatedData.newPassword);

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    console.error('Password reset error:', error);
    return { status: 'failed' };
  }
};