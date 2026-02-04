import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { q, source, target, format } = body;

    if (!q || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: q, target' },
        { status: 400 }
      );
    }

    console.log('[v0] Translation request:', { q: q.substring(0, 50), source, target });
    
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q,
        source: source || 'en',
        target,
        format: format || 'text',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[v0] Translation API error:', response.status, errorText);
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[v0] Translation API response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[v0] Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
