import { Module } from '@nestjs/common';
import { ProductController } from './Product.controller';
import { ProductService } from './Product.service';
import { databaseProviders } from './database/database.providers';
import { ProductProviders } from './database/Products.providers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ExistsStrategy } from './strategies/exists.strategy';

@Module({
  imports:[
    PassportModule,
    JwtModule.register({
      secret:'secretKey_YoucANWritewhateveryoulike',
      signOptions:{expiresIn:'10000s'},
    })
  ],
  controllers: [ProductController],
  providers: [ProductService,...ProductProviders ,...databaseProviders, LocalStrategy,JwtStrategy,ExistsStrategy],
  exports: [...databaseProviders],
})
export class ProductModule {}
