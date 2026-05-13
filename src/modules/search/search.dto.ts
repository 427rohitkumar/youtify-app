import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query cannot be empty').max(100, 'Query too long').trim(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
