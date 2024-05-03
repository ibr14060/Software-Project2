
import * as mongoose from 'mongoose';

export const Cartschema = new mongoose.Schema({

  UserID:mongoose.Schema.Types.ObjectId,
  products: [[String, Number]]

});
