'use client';

import { useActionState } from 'react';
import { ChangePasswordActionState, changePassword } from '@/app/(auth)/actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { WarningIcon, CheckCircleFillIcon } from './icons';

export default function PasswordChangeForm() {
  const [state, formAction] = useActionState<ChangePasswordActionState, FormData>(
    changePassword,
    { status: 'idle' }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.status === 'success' && (
        <div className="flex items-center gap-2 rounded bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          <CheckCircleFillIcon size={16} />
          <p>Password updated successfully.</p>
        </div>
      )}

      {state.status === 'failed' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Failed to update password. Please try again.</p>
        </div>
      )}

      {state.status === 'wrong_password' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Current password is incorrect.</p>
        </div>
      )}

      {state.status === 'invalid_data' && (
        <div className="flex items-center gap-2 rounded bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <WarningIcon size={16} />
          <p>Please check your input and try again.</p>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long.</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={state.status === 'in_progress'}
      >
        {state.status === 'in_progress' ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}