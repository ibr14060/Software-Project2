import { Controller, Request, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('products')
export class ProductsController implements OnModuleInit {

    constructor(
        private productsService: ProductsService,
        @Inject('PRODUCT_SERVICE') private readonly productsClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.productsService.hello();
    }

    @Post('createProduct')
    async createProduct(@Request() req) {
        console.log(req.body);
        return this.productsService.createProduct(req.body);
    }

    @Post('getProducts')
    async getProducts() {
        return this.productsService.getProducts();
    }

    @Post('getProductById')
    async getProductById(@Request() req) {
        console.log(req.body);
        return this.productsService.getProductById(req.body.id);
    }

    @Post('editProduct')
    async editProduct(@Request() req) {
        console.log(req.body);
        return this.productsService.editProduct(req.body.id, req.body);
    }

    @Post('deleteProduct')
    async deleteProduct(@Request() req) {
        console.log(req.body);
        return this.productsService.deleteProduct(req.body.id);
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
