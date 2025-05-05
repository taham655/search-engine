import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="h-11 bg-muted/50 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="h-11 bg-muted/50 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-primary"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      {children}
    </Form>
  );
}
