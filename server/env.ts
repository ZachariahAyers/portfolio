export interface ApiEnv {
  geminiApiKey?: string | undefined;
  geminiModel: string;
  resendApiKey?: string | undefined;
  contactFrom?: string | undefined;
  contactTo?: string | undefined;
}

export const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';

/** Reads the server configuration from environment variables. Empty strings count as unset. */
export function readEnv(source: Record<string, string | undefined>): ApiEnv {
  const value = (key: string) => source[key]?.trim() || undefined;
  return {
    geminiApiKey: value('GEMINI_API_KEY'),
    geminiModel: value('GEMINI_MODEL') ?? DEFAULT_GEMINI_MODEL,
    resendApiKey: value('RESEND_API_KEY'),
    contactFrom: value('CONTACT_FROM'),
    contactTo: value('CONTACT_TO'),
  };
}
