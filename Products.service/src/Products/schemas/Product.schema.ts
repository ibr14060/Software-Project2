
import * as mongoose from 'mongoose';

export const Productschema = new mongoose.Schema({

  ProductName: String,
  ProductImage: String,
  ProductPrice: Number,
  ProductSpecifications: String,
  ProductAvailability: String,
  ProductDescription: String,

});
