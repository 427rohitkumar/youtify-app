'use server';

import { cookies } from 'next/headers';
import { SearchService, SearchResult } from './search.service';
import { SearchRepository } from './search.repository';
import { AuthService } from '../auth/auth.service';
import { SearchQuerySchema } from './search.dto';

async function getUserId() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  const session = await AuthService.decryptSession(sessionToken);
  return (session?.userId as string) || null;
}

export async function searchAction(query: string): Promise<SearchResult[]> {
  const validated = SearchQuerySchema.safeParse({ q: query });
  if (!validated.success) return [];

  const results = await SearchService.searchVideos(validated.data.q);
  
  // Background: save to history if we have a userId
  const userId = await getUserId();
  if (userId) {
    SearchRepository.addRecentSearch(userId, validated.data.q).catch(console.error);
  }

  return results;
}

export async function getHistoryAction(): Promise<string[]> {
  const userId = await getUserId();
  if (!userId) return [];
  return SearchRepository.getRecentSearches(userId);
}

export async function removeHistoryAction(query: string) {
  const userId = await getUserId();
  if (!userId) return;
  await SearchRepository.removeRecentSearch(userId, query);
}

export async function getSuggestionsAction(query: string): Promise<string[]> {
  if (!query) return [];
  return SearchService.getSuggestions(query);
}
