import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  jobId: string;
  vendorId: string;
  plantId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  jobId: {
    type: String,
    required: true,
    index: true,
  },
  vendorId: {
    type: String,
    required: true,
    index: true,
  },
  plantId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  images: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);
