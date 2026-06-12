import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Direct download link for the Google Drive file
  const fileId = '1fnYWiRP3in0IGf2F2Ja0a3ij9nKCLiAe';
  // Use googleapis stream view to get the raw stream reliably
  const url = `https://docs.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(url, {
      headers: {
        // Simple User-Agent to mimic a browser download
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Google Drive responded with status: ${response.status}`);
      return new NextResponse(`Failed to fetch audio: status ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('Content-Type') || 'audio/mpeg';
    const contentLength = response.headers.get('Content-Length');

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }
    // Enable cross-origin resource sharing just in case, though same-origin is default
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    // Return the readable stream directly to the client
    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Error proxying audio from Google Drive:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
