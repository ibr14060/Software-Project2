import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  UserID: mongoose.Schema.Types.ObjectId,
  products: [
    {
      id: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ]
});
