import mongoose, { Document } from 'mongoose';

export interface Cart extends Document {
  readonly UserID: mongoose.Types.ObjectId;
  readonly products: Array<{ id: string; quantity: number }>;
}
