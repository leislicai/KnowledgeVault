export interface Citation {
  id: number;
  name: string;
  excerpt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  kbs?: string[];
}

export interface KnowledgeBaseOption {
  key: string;
  label: string;
  scope: string;
}
