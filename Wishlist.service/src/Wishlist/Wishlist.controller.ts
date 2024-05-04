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
    async getWishlist(userID: string) {
        try {
            console.log("Called with UserID:", userID);
            const products = await this.wishlistService.getWishlist(userID);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
    }
    
    @MessagePattern('editWishlist')
    async editWishlist(command) {
        console.log(command);
        return this.wishlistService.editWishlist(command.id, command.body);
    }

    @MessagePattern('deleteWishlist')
    async deleteWishlist(userID: string) {
        try {
            console.log("Called with UserID:", userID);
            const result = await this.wishlistService.updateWishlist(userID, { ProductIDs: [] });
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
