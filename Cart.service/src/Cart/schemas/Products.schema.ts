import * as mongoose from 'mongoose';

// Define a schema for each product item
const ProductsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
});