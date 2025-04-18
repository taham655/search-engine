'use server';

import { generateText, Message } from 'ai';
import { cookies } from 'next/headers';
import { auth } from '@/app/(auth)/auth';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';
import { myProvider } from '@/lib/ai/providers';
import { userPreferences } from '@/lib/db/schema';

// Initialize the database client
// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const { text: title } = await generateText({
    model: myProvider.languageModel('title-model'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}

export async function saveUserPreferences({
  chatName,
  occupation,
  traits,
  additionalInfo,
}: {
  chatName?: string;
  occupation?: string;
  traits?: string;
  additionalInfo?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  // Check if preferences already exist for the user
  const existingPreferences = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  if (existingPreferences.length > 0) {
    // Update existing preferences
    await db
      .update(userPreferences)
      .set({
        chatName,
        occupation,
        traits,
        additionalInfo,
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.id, existingPreferences[0].id));
  } else {
    // Create new preferences
    await db.insert(userPreferences).values({
      userId: session.user.id,
      chatName,
      occupation,
      traits,
      additionalInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return { success: true };
}

export async function getUserPreferences() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const preferences = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  return preferences.length > 0 ? preferences[0] : null;
}
