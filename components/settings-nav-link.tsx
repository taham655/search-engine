'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SettingsNavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SettingsNavLink({ href, children }: SettingsNavLinkProps) {
  const pathname = usePathname();

  const isActive =
    (href === '/settings' && pathname === '/settings') ||
    (href !== '/settings' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2 rounded-md transition-colors",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}