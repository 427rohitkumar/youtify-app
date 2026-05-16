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
    const cookiesString = process.env.YOUTUBE_COOKIES;
    console.log(`[Extract] Video: ${videoId} | Cookies present: ${!!cookiesString}`);

    // 1. Check DB Cache first
    const { SongRepository } = await import('@/modules/song/song.repository');
    const cachedSong = await SongRepository.findByYoutubeId(videoId);
    
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

    // 2. Setup Agent & Request Options
    let agent = undefined;
    if (cookiesString) {
      try {
        let cookies = [];
        if (cookiesString.trim().startsWith('[')) {
          cookies = JSON.parse(cookiesString);
        } else {
          cookies = cookiesString.split(';').map(c => {
            const [name, ...value] = c.split('=');
            return { name: name.trim(), value: value.join('=').trim(), domain: '.youtube.com' };
          });
        }
        agent = ytdl.createAgent(cookies);
        console.log(`[Extract] Agent created with ${cookies.length} cookies`);
      } catch (e) {
        console.error('[Extract] Cookie parsing error:', e);
      }
    }

    // 3. Extract using ytdl-core with multiple auth layers
    let info;
    try {
      info = await ytdl.getInfo(videoId, { 
        agent,
        requestOptions: {
          headers: {
            cookie: cookiesString || '',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Origin': 'https://www.youtube.com',
            'Referer': 'https://www.youtube.com/watch?v=' + videoId,
            'Sec-Fetch-Mode': 'navigate',
          }
        }
      });
    } catch (e: any) {
      console.warn(`[Extract] ytdl-core failed for ${videoId}: ${e.message}`);
      
      // FALLBACK 1: Cobalt API
      try {
        console.log('[Extract] Trying Fallback 1: Cobalt...');
        const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Youtify/1.0'
          },
          body: JSON.stringify({
            url: `https://www.youtube.com/watch?v=${videoId}`,
            downloadMode: 'audio',
            audioFormat: 'mp3'
          })
        });
        
        const apiData = await cobaltRes.json();
        console.log(`[Extract] Cobalt status: ${apiData.status}`);

        if (apiData && apiData.url) {
          return NextResponse.json({
            url: apiData.url,
            duration: 0,
            title: 'Streaming (Cobalt Fallback)',
            artist: 'YouTube',
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            fromFallback: true
          });
        }
      } catch (fallbackError: any) {
        console.error('[Extract] Cobalt Fallback failed:', fallbackError.message);
      }

      // FALLBACK 2: Invidious API (Very robust against blocks)
      try {
        console.log('[Extract] Trying Fallback 2: Invidious...');
        const invidiousInstance = 'invidious.projectsegfau.lt';
        const invidiousRes = await fetch(`https://${invidiousInstance}/api/v1/videos/${videoId}`);
        const invData = await invidiousRes.json();

        if (invData && invData.adaptiveFormats) {
          // Find the best audio format
          const audioFormat = invData.adaptiveFormats
            .filter((f: any) => f.type.startsWith('audio/'))
            .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))[0];

          if (audioFormat && audioFormat.url) {
            console.log('[Extract] Invidious fallback SUCCESS');
            return NextResponse.json({
              url: audioFormat.url,
              duration: invData.lengthSeconds || 0,
              title: invData.title || 'Streaming (Invidious)',
              artist: invData.author || 'YouTube',
              thumbnail: invData.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              fromFallback: true
            });
          }
        }
      } catch (invError: any) {
        console.error('[Extract] Invidious Fallback failed:', invError.message);
      }
      
      throw e; 
    }

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
