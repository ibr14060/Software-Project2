
import * as mongoose from 'mongoose';

export const Identityschema = new mongoose.Schema({

  username: String,
  password: String,
  First_Name: String,
  Last_Name: String,
  Email: String,
  Phone_Number: String,
  Company: String,
  Address: String,
});
