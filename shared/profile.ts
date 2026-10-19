import profileJson from '../content/profile.json' with { type: 'json' };
import { ProfileSchema } from './content.ts';

/** The full authored profile, as written. The chat prompt quotes all of it. */
export { profileJson };

/** The profile fields the site renders, validated. */
export const profile = ProfileSchema.parse(profileJson);
