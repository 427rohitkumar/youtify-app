import { PlaylistRepository } from '../playlist/playlist.repository';
import { SongRepository } from '../song/song.repository';
import { getSession } from '../auth/auth.controller';
import { HomeData } from './home.types';
import axios from 'axios';
import dbConnect from '@/lib/db';
import User from '../auth/auth.schema';

export class HomeService {
  static getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  static async getDashboardData(providedSession?: any): Promise<HomeData> {
    const session = providedSession || await getSession();
    if (!session) throw new Error('Unauthorized');

    await dbConnect();
    const user = await User.findById(session.userId);
    if (!user) throw new Error('User not found');

    // 1. Populate User Collections
    await user.populate('likedSongs savedSongs');

    // 2. Get Playlists and Liked Songs Count
    const playlists = await PlaylistRepository.findAllByUser(session.userId as string);
    const likedSongsCount = user.likedSongs.length;

    // 2. Get Recently Played from DB
    const recentSongs = await SongRepository.findRecent(6);
    const recentlyPlayed = recentSongs.map(s => ({
      id: s.youtubeId,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail
    }));

    // 3. Recommendations (Fallback to YouTube Trending if no history)
    let recommendations = [];
    try {
      const ytResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          chart: 'mostPopular',
          videoCategoryId: '10', // Music
          maxResults: 6,
          key: process.env.YOUTUBE_API_KEY,
        }
      });

      recommendations = ytResponse.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));
    } catch (err) {
      console.error('YouTube Recommendations Error:', err);
    }

    return {
      greeting: this.getGreeting(),
      userName: (session.email as string).split('@')[0], // Fallback if name not set
      jumpBackIn: {
        likedSongs: {
          count: likedSongsCount,
          thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
        },
        recentPlaylist: playlists.length > 0 ? {
          id: playlists[0]._id.toString(),
          name: playlists[0].name,
          thumbnail: playlists[0].songs[0]?.thumbnail || 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop',
        } : undefined,
      },
      recentlyPlayed,
      recommendations,
      likedSongs: user.likedSongs?.map((s: any) => s.youtubeId) || [],
      savedSongs: user.savedSongs?.map((s: any) => s.youtubeId) || [],
      savedTracks: user.savedSongs?.map((s: any) => ({
        id: s.youtubeId,
        title: s.title,
        artist: s.artist,
        thumbnail: s.thumbnail
      })) || []
    };
  }
}
