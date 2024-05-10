import { Controller, UseGuards } from '@nestjs/common';
import { CartService } from './Cart.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('cart')
export class CartController {
    constructor(private cartService: CartService) {}

    @MessagePattern('hellofromapi')
    hello(req) {
        console.log(req);
        return this.cartService.hello(req.data);
    }

    @MessagePattern('createCart')
    async createCart(command) {
        console.log(command +"from product controller");
        return this.cartService.createCart(command);
    }

    @MessagePattern('getCart')
    async getCart(data: string) {
        try {
            console.log("Received Data:", data);
            console.log("Token:", data);
            const products = await this.cartService.getCart(data);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
    }
    
    
    
    
    @MessagePattern('editCart')
    async editCart(command) {
        console.log(command);
        console.log("token"+ command.token);
        const quantity = command.body.products[1];
        const id = command.body.products[0];
        return this.cartService.editCart(command.token, id,quantity);
    }

    @MessagePattern('deleteCart')
    async deleteCart(command) {
        try {
            console.log("Called with token:", command.token);
            const result = await this.cartService.updateCart(command.token, command.id);
            return result;
        } catch (error) {
            console.error("Error updating cart:", error);
            return { statusCode: 500, message: "Error updating cart" };
        }
    }
    

    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command) {
        const { id, ...rest } = command.user;
        return rest;
    }
}
