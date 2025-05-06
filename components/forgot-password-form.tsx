'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WarningIcon, CheckCircleFillIcon } from './icons';
import { ForgotPasswordActionState, forgotPassword } from '@/app/(auth)/actions';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');

  const [state, formAction] = useActionState<ForgotPasswordActionState, FormData>(
    forgotPassword,
    { status: 'idle' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const formData = new FormData();
    formData.append('email', email);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state.status === 'success' && (
        <div className="flex items-center gap-2 rounded bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          <CheckCircleFillIcon size={16} />
          <p>Password reset link sent! Check your email.</p>
        </div>
      )}

      {state.status === 'failed' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Failed to send reset email. Please try again.</p>
        </div>
      )}

      {state.status === 'invalid_data' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Please enter a valid email address.</p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="resetEmail">Email Address</Label>
        <Input
          id="resetEmail"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="Enter your email address"
          disabled={state.status === 'in_progress'}
        />
        <p className="text-xs text-muted-foreground">
          We&apos;ll send a password reset link to this email.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={state.status === 'in_progress' || state.status === 'success'}
      >
        {state.status === 'in_progress' ? 'Sending...' : 'Reset Password'}
      </Button>
    </form>
  );
}