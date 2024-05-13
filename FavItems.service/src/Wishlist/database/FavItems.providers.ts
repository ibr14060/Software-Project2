
import { Connection } from 'mongoose';
import { FavItemsschema } from '../schemas/FavItems.schema';

export const ProductProviders = [
  {
    provide: 'FAVITEMS_MODEL',
    useFactory: (connection: Connection) => connection.model('FavItem', FavItemsschema),
    inject: ['DATABASE_CONNECTION'],
  },
];
