import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  vendorId: string;
  plantId: string;
  accessToken: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>({
  vendorId: {
    type: String,
    required: true,
    index: true,
  },
  plantId: {
    type: String,
    required: true,
    index: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
});

// Auto-delete expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
