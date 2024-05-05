import { Controller, Request, Get, Inject, OnModuleInit, Post,Headers, Param, Delete } from '@nestjs/common';
import { ProductService } from './Product.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('products')
export class ProductController implements OnModuleInit {

    constructor(
        private productService: ProductService,
        @Inject('PRODUCT_SERVICE') private readonly productsClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.productService.hello();
    }

    @Post('createProduct')
    async createProduct(@Request() req) {
        console.log(req.body.ProductName +"from api gateway");
        return this.productService.createProduct(req.body);
    }

    @Get('getProducts')
    async getProducts(@Headers('authorization') token: string) {
        console.log(this.productService.getProducts(token) +"from api gateway m");
        return this.productService.getProducts(token);
    }

    @Get('getProduct/:id') 
    async getProductById(@Param('id') id: string ,@Headers('authorization') token: string) {
        console.log(id); 
        console.log(token);
        return this.productService.getProductById(id ,token);
    }

    @Post('editProduct/:id') 
    async editProduct( @Param('id') id: string,@Headers('authorization') token: string , @Request() req) {
        console.log(req.body);
        return this.productService.editProduct(id ,token, req.body); // Pass 'id' as a parameter
    }
    
    // For deleteProduct endpoint
    @Delete('deleteProduct/:id') // Define the route parameter ':id'
    async deleteProduct (@Param('id') id: string, @Headers('authorization') token: string  , @Request() req) {
        console.log(req.body);
        return this.productService.deleteProduct(id ,token); // Pass 'id' as a parameter
    }

    onModuleInit() {
        this.productsClient.subscribeToResponseOf('hellofromapi');
        this.productsClient.subscribeToResponseOf('createProduct');
        this.productsClient.subscribeToResponseOf('getProducts');
        this.productsClient.subscribeToResponseOf('getProductById');
        this.productsClient.subscribeToResponseOf('editProduct');
        this.productsClient.subscribeToResponseOf('deleteProduct');
    }
}
