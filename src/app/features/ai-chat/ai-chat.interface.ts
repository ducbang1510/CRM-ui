export interface AiChatRequest {
  sessionId: string;
  message: string;
}

export interface AiChatResponse {
  sessionId: string;
  message: string;
  model: string | null;
  toolsUsed: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolsUsed?: string[];
}
