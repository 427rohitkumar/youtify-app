import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  streamUrl: string;
  listenCount: number;
  isAutoSaved: boolean;
  duration?: number;
  updatedAt: Date;
}

const SongSchema: Schema = new Schema({
  youtubeId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  thumbnail: { type: String, required: true },
  streamUrl: { type: String }, // Store for quick reuse if valid
  listenCount: { type: Number, default: 0 },
  isAutoSaved: { type: Boolean, default: false },
  duration: { type: Number },
}, { timestamps: true });

export default mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
