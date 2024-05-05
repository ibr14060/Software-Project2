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
           // const [id, token] = data.split(','); // Assuming the data is in the format "id,token"
           // console.log("UserID:", id);
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
        return this.cartService.editCart(command.id, command.body);
    }

    @MessagePattern('deleteCart')
    async deleteCart(userID: string) {
        try {
            console.log("Called with UserID:", userID);
            const result = await this.cartService.updateCart(userID, { ProductIDs: [] });
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
