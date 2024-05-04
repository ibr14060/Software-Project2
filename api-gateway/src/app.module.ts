import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { ProductModule } from './Products/Product.module';
import { CartModule } from './cart/Cart.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderModule } from './order/Order.module';
@Module({
  imports: [
    // connection el kafka
    ClientsModule.register([
      {
        name:'ACC_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'account-consumer',
          }
        }
      }
      ,
      {
        name:'PRODUCT_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'product-consumer',
          }
        }
      }
      ,
      {
        name:'CART_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'cart-consumer',
          }
        }
      }
      ,
      {
        name:'ORDER_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['localhost:9092']
          },
          consumer:{
            groupId:'cart-consumer',
          }
        }
      }
    ])
    //
  ,AccountModule,ProductModule ,CartModule ,OrderModule], // bcall el module el feh el APIs bta3t el account
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}