import User from '../auth/auth.schema';
import dbConnect from '@/lib/db';

export class SearchRepository {
  /**
   * Save a search query to user's recent history
   */
  static async addRecentSearch(userId: string, query: string) {
    await dbConnect();
    
    // Add query to front, remove duplicates, limit to 10
    const user = await User.findById(userId);
    if (!user) return;

    const filtered = user.recentSearches.filter((s: string) => s !== query);
    user.recentSearches = [query, ...filtered].slice(0, 10);
    
    await user.save();
  }

  /**
   * Remove a specific query from history
   */
  static async removeRecentSearch(userId: string, query: string) {
    await dbConnect();
    await User.findByIdAndUpdate(userId, {
      $pull: { recentSearches: query }
    });
  }

  /**
   * Get user's recent searches
   */
  static async getRecentSearches(userId: string) {
    await dbConnect();
    const user = await User.findById(userId).select('recentSearches');
    return user?.recentSearches || [];
  }
}
