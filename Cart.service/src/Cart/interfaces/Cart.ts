
import { Document } from 'mongoose';

export interface Cart extends Document {
   
   readonly UserID: String;
   readonly products: [string, number][];

}