import { Controller, Request, Get, Inject, OnModuleInit, Post, Param, Delete } from '@nestjs/common';
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
    async getProducts() {
        console.log(this.productService.getProducts() +"from api gateway m");
        return this.productService.getProducts();
    }

    @Get('getProducts/:id') 
    async getProductById(@Param('id') id: string) {
        console.log(id); // Access the 'id' directly from the route parameters
        return this.productService.getProductById(id);
    }

    @Post('editProduct/:id') 
    async editProduct(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.productService.editProduct(id, req.body); // Pass 'id' as a parameter
    }
    
    // For deleteProduct endpoint
    @Delete('deleteProduct/:id') // Define the route parameter ':id'
    async deleteProduct(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.productService.deleteProduct(id); // Pass 'id' as a parameter
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
