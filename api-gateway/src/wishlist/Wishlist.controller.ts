import { Controller, Request, Get, Inject, OnModuleInit, Post, Param, Delete } from '@nestjs/common';
import { WishlistService } from './Wishlistservice';
import { ClientKafka } from '@nestjs/microservices';

@Controller('Wishlist')
export class WishlistController implements OnModuleInit {

    constructor(
        private wishlistService: WishlistService,
        @Inject('WISHLIST_SERVICE') private readonly WishlistClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.wishlistService.hello();
    }

    @Post('createWishlist')
    async createProduct(@Request() req) {
        console.log(req.body.ProductName +"from api gateway");
        return this.wishlistService.createWishlist(req.body);
    }

    @Get('getWishlist/:id') 
    async getWishlist(@Param('id') id: string) {
        console.log(id); // Access the 'id' directly from the route parameters
        return this.wishlistService.getWishlist(id);
    }

    @Post('editWishlist/:id') 
    async editWishlist(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.wishlistService.editWishlist(id, req.body); // Pass 'id' as a parameter
    }
    
    // For deleteProduct endpoint
    @Delete('deleteWishlist/:id') // Define the route parameter ':id'
    async deleteWishlist(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.wishlistService.deleteWishlist(id); // Pass 'id' as a parameter
    }

    onModuleInit() {
        this.WishlistClient.subscribeToResponseOf('hellofromapi');
        this.WishlistClient.subscribeToResponseOf('createWishlist');
        this.WishlistClient.subscribeToResponseOf('getWishlist');
        this.WishlistClient.subscribeToResponseOf('editWishlist');
        this.WishlistClient.subscribeToResponseOf('deleteWishlist');
    }
}
