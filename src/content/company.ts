import data from '../../content/company-projects.json' with { type: 'json' };
import { ProfileSchema } from './schema.ts';

export const companyProjects = ProfileSchema.shape.projects.parse(data);
