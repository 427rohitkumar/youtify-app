import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  recentSearches: string[];
  likedSongs: mongoose.Types.ObjectId[];
  savedSongs: mongoose.Types.ObjectId[];
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    recentSearches: {
      type: [String],
      default: [],
    },
    likedSongs: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
      default: [],
    },
    savedSongs: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
      default: [],
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
