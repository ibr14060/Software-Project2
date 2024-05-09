
import * as mongoose from 'mongoose';

export const Cartschema = new mongoose.Schema({

  UserID:mongoose.Schema.Types.ObjectId,
  products: [  [
    { type: String, required: true },
    { type: Number, required: true }
]]

});
