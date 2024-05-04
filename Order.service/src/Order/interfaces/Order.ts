
import { Document } from 'mongoose';

export interface Order extends Document {
   
   readonly UserID: String;
   readonly products: [string, number][];

}