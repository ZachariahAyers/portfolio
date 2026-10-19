import answersJson from '../../content/answers.json' with { type: 'json' };
import profileJson from '../../content/profile.json' with { type: 'json' };
import { AnswerSetSchema, ProfileSchema } from './schema.ts';

export const profile = ProfileSchema.parse(profileJson);

export const answerSet = AnswerSetSchema.parse(answersJson);
