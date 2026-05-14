import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

// Note: @distube/ytdl-core is a pure JS library that works perfectly on Vercel/Linux.
// Using cookies helps bypass "Sign in to confirm you're not a bot" errors.

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // 1. Check DB Cache first
    const { SongRepository } = await import('@/modules/song/song.repository');
    const cachedSong = await SongRepository.findByYoutubeId(videoId);
    
    // We only use cache if it has a streamUrl AND it's reasonably fresh (less than 2 hours old)
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

    // 2. Setup Agent with Cookies if available
    let agent = undefined;
    const cookiesString = process.env.YOUTUBE_COOKIES;
    
    if (cookiesString) {
      try {
        // Try to parse as JSON first (if user provided JSON array)
        // Otherwise treat as a raw cookie string
        let cookies = [];
        if (cookiesString.trim().startsWith('[')) {
          cookies = JSON.parse(cookiesString);
        } else {
          // Convert raw cookie string to the format ytdl-core expects
          // or just pass as headers (Distube version handles this well)
          cookies = cookiesString.split(';').map(c => {
            const [name, ...value] = c.split('=');
            return { name: name.trim(), value: value.join('=').trim(), domain: '.youtube.com' };
          });
        }
        agent = ytdl.createAgent(cookies);
      } catch (e) {
        console.warn('Failed to parse YOUTUBE_COOKIES, falling back to no agent:', e);
      }
    }

    // 3. Extract using ytdl-core
    const info = await ytdl.getInfo(videoId, { agent });
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highestaudio',
      filter: 'audioonly' 
    });

    if (!format || !format.url) {
      throw new Error('Could not find a valid audio stream URL');
    }

    const streamUrl = format.url;
    const duration = parseInt(info.videoDetails.lengthSeconds);

    // 4. Populate Cache Background
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
    
    let errorMessage = 'Extraction failed. YouTube might be blocking the request.';
    if (error.message?.includes('confirm you’re not a bot')) {
      errorMessage = 'YouTube Bot Detection: Please provide valid YOUTUBE_COOKIES in environment variables.';
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: error.message 
    }, { status: 500 });
  }
}
