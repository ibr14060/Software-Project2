import { Controller, Request, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
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
        console.log(req.body);
        return this.productService.createProduct(req.body);
    }

    @Post('getProducts')
    async getProducts() {
        return this.productService.getProducts();
    }

    @Post('getProductById')
    async getProductById(@Request() req) {
        console.log(req.body);
        return this.productService.getProductById(req.body.id);
    }

    @Post('editProduct')
    async editProduct(@Request() req) {
        console.log(req.body);
        return this.productService.editProduct(req.body.id, req.body);
    }

    @Post('deleteProduct')
    async deleteProduct(@Request() req) {
        console.log(req.body);
        return this.productService.deleteProduct(req.body.id);
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
