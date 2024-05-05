import { Controller, UseGuards } from '@nestjs/common';
import { wishlistService } from './Wishlist.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
    constructor(private wishlistService: wishlistService) {}

    @MessagePattern('hellofromapi')
    hello(req) {
        console.log(req);
        return this.wishlistService.hello(req.data);
    }

    @MessagePattern('createWishlist')
    async createWishlist(command) {
        console.log(command +"from product controller");
        return this.wishlistService.createWishlist(command);
    }

    @MessagePattern('getWishlist')
    async getWishlist(token: string) {
        try {
            console.log("Called with token:", token);
            const products = await this.wishlistService.getWishlist(token);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
    }
    
    @MessagePattern('editWishlist')
    async editWishlist(command) {
        console.log(command.token);
        return this.wishlistService.editWishlist(command.token, command.body);
    }

    @MessagePattern('deleteWishlist')
    async deleteWishlist(token: string) {
        try {
            console.log("Called with token:", token);
            const result = await this.wishlistService.updateWishlist(token, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating Wishlist:", error);
            return { statusCode: 500, message: "Error updating Wishlist" };
        }
    }
    

    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command) {
        const { id, ...rest } = command.user;
        return rest;
    }
}
