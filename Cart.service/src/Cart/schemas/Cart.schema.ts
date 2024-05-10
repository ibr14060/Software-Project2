import * as mongoose from 'mongoose';

export const CartSchema = new mongoose.Schema({
  UserID: mongoose.Schema.Types.ObjectId,
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ]
});
