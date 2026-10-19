export interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  /** Reveal the text with the typing effect. */
  animate: boolean;
}

export type ChatDialog = 'me' | 'projects' | 'skills' | 'questions' | null;

export type ProfileSection = 'me' | 'projects' | 'skills';
