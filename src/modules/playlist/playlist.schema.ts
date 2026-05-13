import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaylistSong {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  addedAt: Date;
}

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  songs: IPlaylistSong[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSongSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  thumbnail: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

const PlaylistSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
    },
    songs: [PlaylistSongSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Playlist || mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
