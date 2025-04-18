export const DEFAULT_CHAT_MODEL: string = 'openai-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'openai-model',
    name: 'OpenAI GPT-4o-mini',
    description: 'OpenAI model with web search capabilities',
  }
];
