import { NextRequest, NextResponse } from 'next/server';
import { create } from 'youtube-dl-exec';
import path from 'path';

// Note: youtube-dl-exec might need to download the binary first.
// In a serverless environment, this might be tricky, but on a VPS it's perfect.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    // 1. Check DB Cache first
    const { SongRepository } = await import('@/modules/song/song.repository');
    const cachedSong = await SongRepository.findByYoutubeId(videoId);
    
    if (cachedSong && cachedSong.streamUrl) {
      // Note: streamUrl might expire, but we'll try it first
      return NextResponse.json({
        url: cachedSong.streamUrl,
        duration: cachedSong.duration,
        title: cachedSong.title,
        artist: cachedSong.artist,
        thumbnail: cachedSong.thumbnail,
        fromCache: true
      });
    }

    // 2. Extract if not cached
    const binPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');
    const youtubedl = create(binPath);
    
    const output: any = await youtubedl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      format: 'bestaudio/best',
    });

    if (!output || (!output.url && !output.formats)) {
      throw new Error('Could not find a valid stream URL');
    }

    const streamUrl = output.url || output.formats?.find((f: any) => f.acodec !== 'none' && f.vcodec === 'none')?.url;

    // 3. Populate Cache Background
    try {
      await SongRepository.saveOrUpdate({
        youtubeId: videoId,
        title: output.title,
        artist: output.uploader || output.artist || 'Unknown',
        thumbnail: output.thumbnail,
        streamUrl: streamUrl,
        duration: output.duration,
      });
    } catch (e) {
      console.warn('Failed to cache song:', e);
    }

    return NextResponse.json({
      url: streamUrl,
      duration: output.duration,
      title: output.title,
      artist: output.uploader || output.artist,
      thumbnail: output.thumbnail,
    });
  } catch (error: any) {
    console.error('yt-dlp extraction error:', error);
    
    // Final Fallback: If yt-dlp fails, we might try a public API or show a better error
    return NextResponse.json({ 
      error: 'Extraction failed. This video might be restricted or YouTube is blocking the request.',
      details: error.message 
    }, { status: 500 });
  }
}
