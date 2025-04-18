import { auth } from '@/app/(auth)/auth';
import PasswordChangeForm from '@/components/password-change-form';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function PasswordSettingsPage() {
  const session = await auth();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Password Management</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your current password</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Reset your password if you've forgotten it</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}