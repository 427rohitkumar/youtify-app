import Song from './song.schema';
import dbConnect from '@/lib/db';

export class SongRepository {
  static async findByYoutubeId(youtubeId: string) {
    await dbConnect();
    return Song.findOne({ youtubeId });
  }

  static async saveOrUpdate(songData: any) {
    await dbConnect();
    return Song.findOneAndUpdate(
      { youtubeId: songData.id || songData.youtubeId },
      { 
        ...songData, 
        youtubeId: songData.id || songData.youtubeId,
        $inc: { listenCount: 1 } 
      },
      { upsert: true, returnDocument: 'after' }
    );
  }

  static async findRecent(limit = 6) {
    await dbConnect();
    return Song.find({ isAutoSaved: true })
      .sort({ updatedAt: -1 })
      .limit(limit);
  }
}
