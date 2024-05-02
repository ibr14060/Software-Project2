import { Controller, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('Product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @MessagePattern('hellofromapi')
    hello(req) {
        console.log(req);
        return this.productService.hello(req.data);
    }

    @MessagePattern('createProduct')
    async createProduct(command) {
        console.log(command);
        return this.productService.createProduct(command.body);
    }

    @MessagePattern('getProducts')
    async getProducts(command) {
        console.log(command);
        return this.productService.getProducts();
    }

    @MessagePattern('getProductById')
    async getProductById(command) {
        console.log(command);
        return this.productService.getProductById(command.id);
    }

    @MessagePattern('editProduct')
    async editProduct(command) {
        console.log(command);
        return this.productService.editProduct(command.id, command.body);
    }

    @MessagePattern('deleteProduct')
    async deleteProduct(command) {
        console.log(command);
        return this.productService.deleteProduct(command.id);
    }

    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command) {
        const { id, ...rest } = command.user;
        return rest;
    }
}
