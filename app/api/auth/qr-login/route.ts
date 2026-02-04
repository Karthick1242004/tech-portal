import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const result = await authService.qrLogin(token);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('[v0] QR Login error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}
