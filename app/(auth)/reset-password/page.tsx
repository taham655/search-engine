'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircleFillIcon, WarningIcon } from '@/components/icons';
import { ResetPasswordActionState, resetPassword } from './actions';

// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/boogle_fl.png"
              alt="Boogle Logo"
              width={96}
              height={96}
              priority
              className="object-contain"
            />
          </div>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>
            Please wait while we load your reset password page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
        </CardContent>
      </Card>
    </div>
  );
}

// The main content component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(
    resetPassword,
    { status: 'idle' }
  );

  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword || confirmPassword === '');
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('email', email);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    formAction(formData);
  };

  // Show error if token or email is missing
  if (!token || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center">
            <div className="flex justify-center mb-2">
              <Image
                src="/boogle_fl.png"
                alt="Boogle Logo"
                width={96}
                height={96}
                priority
                className="object-contain"
              />
            </div>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              This password reset link appears to be invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded bg-red-50 p-3 mb-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <WarningIcon size={16} />
              <p>The reset link is missing required information.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/boogle_fl.png"
              alt="Boogle Logo"
              width={96}
              height={96}
              priority
              className="object-contain"
            />
          </div>
          <CardTitle>Reset Your Boogle Password</CardTitle>
          <CardDescription>
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.status === 'success' && (
            <div className="flex items-center gap-2 rounded bg-green-50 p-3 mb-4 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
              <CheckCircleFillIcon size={16} />
              <p>Your password has been reset successfully!</p>
            </div>
          )}

          {state.status === 'token_expired' && (
            <div className="flex items-center gap-2 rounded bg-red-50 p-3 mb-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <WarningIcon size={16} />
              <p>This reset link has expired. Please request a new one.</p>
            </div>
          )}

          {state.status === 'invalid_token' && (
            <div className="flex items-center gap-2 rounded bg-red-50 p-3 mb-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <WarningIcon size={16} />
              <p>This reset link is invalid. Please request a new one.</p>
            </div>
          )}

          {state.status === 'failed' && (
            <div className="flex items-center gap-2 rounded bg-red-50 p-3 mb-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              <WarningIcon size={16} />
              <p>An error occurred while resetting your password. Please try again.</p>
            </div>
          )}

          {state.status !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={state.status === 'in_progress'}
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={state.status === 'in_progress'}
                  className={!passwordsMatch ? 'border-red-500' : ''}
                />
                {!passwordsMatch && (
                  <p className="text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  state.status === 'in_progress' ||
                  !passwordsMatch ||
                  newPassword.length < 6
                }
              >
                {state.status === 'in_progress' ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          {state.status === 'success' && (
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordContent />
    </Suspense>
  );
}