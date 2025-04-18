import { auth } from '@/app/(auth)/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View and manage your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <p className="text-sm font-medium">Email</p>
              <p className="col-span-2 text-sm">{session?.user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}