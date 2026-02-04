import { verifyToken, generateToken, TokenPayload } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Session from '../models/Session';

export interface QrLoginResponse {
  accessToken: string;
  vendorId: string;
  plantId: string;
}

export class AuthService {
  async qrLogin(token: string): Promise<QrLoginResponse> {
    // Verify the QR token
    let payload: TokenPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      throw new Error('Invalid QR code token');
    }

    const { vendorId, plantId } = payload;

    if (!vendorId || !plantId) {
      throw new Error('Invalid token payload');
    }

    // Connect to database
    await connectDB();

    // Generate new access token for the session
    const accessToken = generateToken({ vendorId, plantId });

    // Create session in database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

    await Session.create({
      vendorId,
      plantId,
      accessToken,
      expiresAt,
    });

    return {
      accessToken,
      vendorId,
      plantId,
    };
  }

  async validateSession(accessToken: string): Promise<boolean> {
    await connectDB();

    const session = await Session.findOne({
      accessToken,
      expiresAt: { $gt: new Date() },
    });

    return !!session;
  }
}

export const authService = new AuthService();
