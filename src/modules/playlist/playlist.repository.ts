import Playlist from './playlist.schema';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export class PlaylistRepository {
  static async create(userId: string, name: string) {
    await dbConnect();
    return Playlist.create({ userId, name, songs: [] });
  }

  static async findAllByUser(userId: string) {
    await dbConnect();
    return Playlist.find({ userId }).sort({ updatedAt: -1 });
  }

  static async findById(id: string) {
    await dbConnect();
    return Playlist.findById(id);
  }

  static async addSong(playlistId: string, song: any) {
    await dbConnect();
    return Playlist.findByIdAndUpdate(
      playlistId,
      { $push: { songs: { ...song, addedAt: new Date() } } },
      { new: true }
    );
  }

  static async removeSong(playlistId: string, songId: string) {
    await dbConnect();
    return Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: { id: songId } } },
      { new: true }
    );
  }

  static async delete(id: string) {
    await dbConnect();
    return Playlist.findByIdAndDelete(id);
  }

  static async rename(id: string, name: string) {
    await dbConnect();
    return Playlist.findByIdAndUpdate(id, { name }, { new: true });
  }
}
