
import * as mongoose from 'mongoose';

export const Orderschema = new mongoose.Schema({

  UserID:mongoose.Schema.Types.ObjectId,
  products: [[String, Number]],
   total: Number,
   status: String,
   address: String,
   phone: String,
   email: String,

});
