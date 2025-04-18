import { auth } from '@/app/(auth)/auth';
import { getUserPreferences } from '@/app/(chat)/actions';
import T3ChatPreferencesForm from '@/components/t3-chat-preferences-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ChatSettingsPage() {
  const session = await auth();
  const preferences = await getUserPreferences();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Customize Boogle</h2>

      <Card>
        <CardHeader>
          <CardTitle>Chat Preferences</CardTitle>
          <CardDescription>Personalize your chat experience</CardDescription>
        </CardHeader>
        <CardContent>
          <T3ChatPreferencesForm
            initialValues={{
              chatName: preferences?.chatName || '',
              occupation: preferences?.occupation || '',
              traits: preferences?.traits || '',
              additionalInfo: preferences?.additionalInfo || '',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}