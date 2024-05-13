import { Module } from '@nestjs/common';
import { WishlistController } from './Wishlist.controller';
import { wishlistService } from './Wishlist.service';
import { databaseProviders } from './database/database.providers';
import { ProductProviders } from './database/Wishlist.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      secret:'secretKey_YoucANWritewhateveryoulike',
      signOptions:{expiresIn:'10000s'},
    })
  ],
  controllers: [WishlistController],
  providers: [wishlistService, ...ProductProviders, ...databaseProviders, JwtStrategy],
  exports: [...databaseProviders],
})
export class WishlistModule {}
