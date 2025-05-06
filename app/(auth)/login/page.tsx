'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import Image from 'next/image';

import { AuthForm } from '@/components/auth-form';
import { SubmitButton } from '@/components/submit-button';

import { login, type LoginActionState } from '../actions';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast({
        type: 'error',
        description: 'Invalid credentials!',
      });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get('email') as string);
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen bg-gradient-to-b from-background to-muted">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-md p-8 overflow-hidden rounded-2xl shadow-lg bg-background border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex justify-center transition-transform hover:scale-105">
              <Image
                src="/logos/boogle_1.webp"
                alt="Boogle Logo"
                width={160}
                height={160}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Sign In</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400">
                Access your Boogle search engine and discover the world
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AuthForm action={handleSubmit} defaultEmail={email}>
              <SubmitButton isSuccessful={isSuccessful} className="w-full mt-2">Sign In</SubmitButton>

              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary/80 hover:text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-6 mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-background text-gray-500 dark:text-zinc-500">Don&apos;t have an account?</span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Sign up for free
                </Link>
              </div>
            </AuthForm>
          </div>
        </div>
      </div>
    </div>
  );
}
