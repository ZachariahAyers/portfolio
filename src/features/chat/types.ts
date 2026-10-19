export interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  /** Reveal the text with the typing effect. Only fresh model answers animate. */
  animate: boolean;
}

export type ChatDialog = 'contact' | 'me' | 'projects' | 'skills' | 'questions' | null;

export type ProfileSection = 'me' | 'projects' | 'skills';
