
import { Connection } from 'mongoose';
import { Productschema } from '../schemas/Product.schema';

export const ProductProviders = [
  {
    provide: 'IDENTITY_MODEL',
    useFactory: (connection: Connection) => connection.model('products', Productschema),
    inject: ['DATABASE_CONNECTION'],
  },
];
