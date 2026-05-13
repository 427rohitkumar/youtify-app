import { z } from 'zod';

export const CreatePlaylistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long').trim(),
});

export const AddSongSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  thumbnail: z.string(),
});

export type CreatePlaylistInput = z.infer<typeof CreatePlaylistSchema>;
export type AddSongInput = z.infer<typeof AddSongSchema>;
