import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/app/(auth)/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowUpIcon } from '@/components/icons';
import { SettingsNavLink } from '@/components/settings-nav-link';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex flex-col max-w-6xl p-4">
        <div className="flex items-center gap-6 mb-4">
          <Button variant="ghost" size="sm" asChild className="py-1 px-2 h-auto">
            <Link href="/" className="flex items-center">
              <span className="rotate-[-90deg] inline-block">
                <ArrowUpIcon />
              </span>
              <span className="ml-1.5">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <Separator className="mb-6" />

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 md:mr-8 mb-6 md:mb-0">
            <nav className="flex flex-col space-y-1">
              <SettingsNavLink href="/settings">
                Account
              </SettingsNavLink>
              <SettingsNavLink href="/settings/password">
                Password
              </SettingsNavLink>
              <SettingsNavLink href="/settings/chat">
                Customize Boogle
              </SettingsNavLink>
            </nav>
          </div>

          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}