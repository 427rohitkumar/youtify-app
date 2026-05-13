export interface HomeData {
  greeting: string;
  userName: string;
  jumpBackIn: {
    likedSongs: {
      count: number;
      thumbnail: string;
    };
    recentPlaylist?: {
      id: string;
      name: string;
      thumbnail: string;
    };
  };
  recentlyPlayed: Array<{
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
  }>;
  likedSongs: string[];
  savedSongs: string[];
}
