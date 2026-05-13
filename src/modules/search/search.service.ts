const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=';

export interface SearchResult {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export class SearchService {
  /**
   * Search YouTube for videos
   */
  static async searchVideos(query: string): Promise<SearchResult[]> {
    if (!YOUTUBE_API_KEY) throw new Error('YouTube API Key missing');

    const res = await fetch(
      `${SEARCH_URL}?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
    );

    const data = await res.json();

    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  }

  /**
   * Get search suggestions (Autocomplete)
   */
  static async getSuggestions(query: string): Promise<string[]> {
    try {
      const res = await fetch(`${SUGGEST_URL}${encodeURIComponent(query)}`);
      const data = await res.json();
      return data[1] || []; // Firefox suggest API returns [query, [suggestions]]
    } catch (err) {
      return [];
    }
  }
}
