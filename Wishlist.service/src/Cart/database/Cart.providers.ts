
import { Connection } from 'mongoose';
import { Cartschema } from '../schemas/Cart.schema';

export const ProductProviders = [
  {
    provide: 'CART_MODEL',
    useFactory: (connection: Connection) => connection.model('Cart', Cartschema),
    inject: ['DATABASE_CONNECTION'],
  },
];
