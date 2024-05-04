
import * as mongoose from 'mongoose';

export const Orderschema = new mongoose.Schema({

  UserID:mongoose.Schema.Types.ObjectId,
  products: [[String, Number]]

});
