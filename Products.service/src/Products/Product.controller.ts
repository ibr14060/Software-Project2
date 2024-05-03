import { Controller, UseGuards } from '@nestjs/common';
import { ProductService } from './Product.service';
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
        console.log(command +"from product controller");
        return this.productService.createProduct(command);
    }

    @MessagePattern('getProducts')
    async getProducts() {
        try {
            console.log("called");
            const products = await this.productService.getProducts();
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
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
