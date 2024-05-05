import { Controller, Request, Get, Inject, OnModuleInit, Post,Headers, Param, Delete } from '@nestjs/common';
import { CartService } from './Cart.service';
import { ClientKafka } from '@nestjs/microservices';


@Controller('cart')
export class CartController implements OnModuleInit {

    constructor(
        private cartService: CartService,
        @Inject('CART_SERVICE') private readonly cartClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.cartService.hello();
    }

    @Post('createCart')
    async createProduct(@Request() req) {
        console.log(req.body.ProductName +"from api gateway");
        return this.cartService.createCart(req.body);
    }

    @Get('getCart') 
    async getCart( @Headers('authorization') token: string) {
        console.log("from controller t" + token)
       // console.log(id); // Access the 'id' directly from the route parameters
        return this.cartService.getCart( token);
    }
    

    @Post('editCart/:id') 
    async editCart(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.cartService.editCart(id, req.body); // Pass 'id' as a parameter
    }
    
    // For deleteProduct endpoint
    @Delete('deleteCart/:id') // Define the route parameter ':id'
    async deleteCart(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.cartService.deleteCart(id); // Pass 'id' as a parameter
    }

    onModuleInit() {
        this.cartClient.subscribeToResponseOf('hellofromapi');
        this.cartClient.subscribeToResponseOf('createCart');
        this.cartClient.subscribeToResponseOf('getCart');
        this.cartClient.subscribeToResponseOf('editCart');
        this.cartClient.subscribeToResponseOf('deleteCart');
    }
}
