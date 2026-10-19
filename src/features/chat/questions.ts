export const SUGGESTED_QUESTIONS = [
  'What makes you stand out from other senior engineers?',
  'Show me your most impactful enterprise transformations',
  'Tell me about your leadership and mentoring experience',
  "What's your experience with AI/ML in production?",
  'Why are you looking for a new opportunity?',
  "What's your preferred tech stack and why?",
] as const;

/** How many suggestions fit on a phone screen. */
export const MOBILE_SUGGESTION_COUNT = 2;

const FOLLOW_UPS: Record<string, readonly string[]> = {
  'What makes you stand out from other senior engineers?': [
    'How do you measure business impact in your projects?',
    'Tell me more about your AI implementation experience',
    "What's your approach to making teams better?",
    'Can you share a specific example of shipping at scale?',
  ],
  'Show me your most impactful enterprise transformations': [
    'How did you handle the technical debt during migrations?',
    'What was the timeline for the AmeriSave transformation?',
    'How did you move 40+ VB6 applications to .NET 8?',
    'How did you get buy-in from 60+ developers?',
  ],
  'Tell me about your leadership and mentoring experience': [
    "What's the Octo/Tellaro framework you created?",
    'How do you run architecture review boards?',
    "What's your approach to incident response?",
    "How did you make 'Agile not suck'?",
  ],
  "What's your experience with AI/ML in production?": [
    'What does an AI engineering layer for a team include?',
    'Why run AI inference on-premises?',
    'How do you build MCP servers?',
    'Which AI tools do you prefer and why?',
  ],
  'Why are you looking for a new opportunity?': [
    'What specific tech stacks excite you most?',
    'Why Fort Collins, Austin, Seattle, or Santa Fe?',
    'What type of AI role interests you?',
    "What's your ideal company culture?",
  ],
  "What's your preferred tech stack and why?": [
    'How do you choose between different technologies?',
    "What's your experience with cloud platforms?",
    'Tell me about your Python vs Node.js preference',
    'What AI frameworks are you working with?',
  ],
  'Describe a challenging technical problem you solved': [
    'How did you keep 200 daily users working during the migration?',
    'How did the release pipeline get deploys from weeks to minutes?',
    'What other complex problems have you tackled?',
    'How do you approach constraint-driven innovation?',
  ],
  "What's your experience with microservices architecture?": [
    'How did you decompose the monolithic database?',
    "What's your approach to service boundaries?",
    'Tell me about GraphQL Federation implementation',
    'How do you handle distributed system challenges?',
  ],
  'How do you stay current with new technologies?': [
    'What are you learning right now?',
    'Tell me about your open source projects',
    'How do you balance learning with shipping?',
    "What's your take on the latest AI developments?",
  ],
};

const GENERIC_FOLLOW_UPS = [
  'Can you elaborate on that?',
  'What specific technologies did you use?',
  'How did you measure the success?',
  'What challenges did you face?',
] as const;

/** Questions to offer after an answer to `question`. */
export function followUpsFor(question: string | null): readonly string[] {
  return (question && FOLLOW_UPS[question]) || GENERIC_FOLLOW_UPS;
}

/** Questions in the "Quick Questions" panel that get highlighted. */
export const FEATURED_QUESTIONS: ReadonlySet<string> = new Set([
  'What makes you stand out from other senior engineers?',
  'What projects are you most proud of?',
  "What's your experience with AI/ML in production?",
]);
