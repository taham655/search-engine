'use server';

import { z } from 'zod';
import { compareSync } from 'bcrypt-ts';

import { createUser, getUser, updateUserPassword, createPasswordResetToken } from '@/lib/db/queries';
import { sendPasswordResetEmail } from '@/lib/email';

import { signIn, auth } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface ChangePasswordActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data' | 'wrong_password';
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const changePassword = async (
  _: ChangePasswordActionState,
  formData: FormData,
): Promise<ChangePasswordActionState> => {
  try {
    const validatedData = changePasswordSchema.parse({
      currentPassword: formData.get('currentPassword'),
      newPassword: formData.get('newPassword'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const session = await auth();

    if (!session?.user?.email) {
      return { status: 'failed' };
    }

    // Get user to verify current password
    const [user] = await getUser(session.user.email);

    if (!user) {
      return { status: 'failed' };
    }

    // Verify current password
    const isCurrentPasswordValid = compareSync(validatedData.currentPassword, user.password || '');

    if (!isCurrentPasswordValid) {
      return { status: 'wrong_password' };
    }

    // Update password
    await updateUserPassword(session.user.email, validatedData.newPassword);

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};

export interface ForgotPasswordActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data' | 'user_not_found';
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPassword = async (
  _: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> => {
  try {
    const validatedData = forgotPasswordSchema.parse({
      email: formData.get('email'),
    });

    // Check if user exists
    const [user] = await getUser(validatedData.email);

    if (!user) {
      // Don't reveal user existence for security, but log it
      console.log(`Password reset requested for non-existent email: ${validatedData.email}`);
      return { status: 'success' }; // Return success for security reasons
    }

    // Generate reset token
    const { resetToken, resetTokenExpiry } = await createPasswordResetToken(validatedData.email);

    // Send reset email
    const { success } = await sendPasswordResetEmail(
      validatedData.email,
      resetToken,
      resetTokenExpiry
    );

    if (!success) {
      console.error(`Failed to send password reset email to ${validatedData.email}`);
      return { status: 'failed' };
    }

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    console.error('Password reset error:', error);
    return { status: 'failed' };
  }
};
