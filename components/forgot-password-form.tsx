'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WarningIcon, CheckCircleFillIcon } from './icons';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'in_progress' | 'success' | 'failed'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setStatus('in_progress');

    // This is a placeholder for the actual implementation
    // In a real application, you would send a request to a server endpoint
    // to handle the password reset email
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, let's simulate success
      setStatus('success');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          <CheckCircleFillIcon size={16} />
          <p>Password reset link sent! Check your email.</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Failed to send reset email. Please try again.</p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="resetEmail">Email Address</Label>
        <Input
          id="resetEmail"
          name="resetEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="Enter your email address"
        />
        <p className="text-xs text-muted-foreground">
          We&apos;ll send a password reset link to this email.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={status === 'in_progress' || status === 'success'}
      >
        {status === 'in_progress' ? 'Sending...' : 'Reset Password'}
      </Button>
    </form>
  );
}