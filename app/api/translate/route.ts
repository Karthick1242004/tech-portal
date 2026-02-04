import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

export async function POST(request: Request) {
  if (!GOOGLE_API_KEY) {
    console.error('[Translation] Missing GOOGLE_TRANSLATE_API_KEY');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { q, source, target, format } = body;

    if (!q || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: q, target' },
        { status: 400 }
      );
    }

    // Google Translate API URL
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
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
      const errorData = await response.json();
      console.error('[Translation] API error:', response.status, errorData);

      // Handle Specific Google API Errors
      if (response.status === 403) {
        return NextResponse.json({ error: 'Invalid API Key or Quota exceeded' }, { status: 403 });
      }
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded, please try again later' }, { status: 429 });
      }

      return NextResponse.json(
        { error: errorData.error?.message || 'Translation provider error' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Google API returns { data: { translations: [{ translatedText: "..." }] } }
    // We map it to { translatedText: "..." } to match frontend expectations
    const translatedText = data.data?.translations?.[0]?.translatedText;

    if (!translatedText) {
      throw new Error('Invalid response format from Translation Provider');
    }

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error('[Translation] Internal error:', error);
    return NextResponse.json(
      { error: 'Internal translation service failed' },
      { status: 500 }
    );
  }
}
