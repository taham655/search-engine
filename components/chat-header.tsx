'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';
import { EyeOff } from 'lucide-react';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function PureChatHeader({
  chatId,
  selectedModelId,
  isReadonly,
  isIncognito = false,
}: {
  chatId: string;
  selectedModelId: string;
  isReadonly: boolean;
  isIncognito?: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="md:px-2 px-2 md:h-fit"
              onClick={() => {
                router.push('/');
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      <div className="flex-1 flex justify-end items-center">
        {isIncognito && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold">
                <EyeOff className="w-3 h-3" />
                <span>Incognito</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Incognito mode enabled. Chat history won't be saved.
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId &&
         prevProps.isIncognito === nextProps.isIncognito;
});
