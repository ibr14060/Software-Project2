
import { Document } from 'mongoose';

export interface Order extends Document {
   
   readonly UserID: String;
   readonly total: number;
   readonly status: string;
   readonly address: string;
   readonly phone: string;
   readonly email: string;
   readonly products: [string, number][];

}