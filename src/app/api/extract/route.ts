import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

// Note: @distube/ytdl-core is a pure JS library that works perfectly on Vercel/Linux.
// It doesn't require native binaries like yt-dlp.exe.

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
    
    // We only use cache if it has a streamUrl AND it's reasonably fresh (less than 2 hours old)
    // Note: YouTube stream URLs usually expire in 6 hours, but 2 is safer.
    const isCacheFresh = cachedSong?.updatedAt && (Date.now() - new Date(cachedSong.updatedAt).getTime() < 1000 * 60 * 60 * 2);

    if (cachedSong && cachedSong.streamUrl && isCacheFresh) {
      return NextResponse.json({
        url: cachedSong.streamUrl,
        duration: cachedSong.duration,
        title: cachedSong.title,
        artist: cachedSong.artist,
        thumbnail: cachedSong.thumbnail,
        fromCache: true
      });
    }

    // 2. Extract using ytdl-core (Cross-platform & Serverless friendly)
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly' 
    });

    if (!format || !format.url) {
      throw new Error('Could not find a valid audio stream URL');
    }

    const streamUrl = format.url;
    const duration = parseInt(info.videoDetails.lengthSeconds);

    // 3. Populate Cache Background
    try {
      await SongRepository.saveOrUpdate({
        youtubeId: videoId,
        title: info.videoDetails.title,
        artist: info.videoDetails.author.name || 'Unknown',
        thumbnail: info.videoDetails.thumbnails[0]?.url,
        streamUrl: streamUrl,
        duration: duration,
      });
    } catch (e) {
      console.warn('Failed to cache song:', e);
    }

    return NextResponse.json({
      url: streamUrl,
      duration: duration,
      title: info.videoDetails.title,
      artist: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
    });
  } catch (error: any) {
    console.error('Extraction error:', error);
    
    return NextResponse.json({ 
      error: 'Extraction failed. This video might be restricted or YouTube is blocking the request.',
      details: error.message 
    }, { status: 500 });
  }
}
