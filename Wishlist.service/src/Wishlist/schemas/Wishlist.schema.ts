
import * as mongoose from 'mongoose';

export const Wishlistschema = new mongoose.Schema({

  UserID:mongoose.Schema.Types.ObjectId,
  products: [[String, Number]]

});
