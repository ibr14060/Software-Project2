import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Wishlist } from './interfaces/Wishlist';
import { CreateWishlistDto } from './dto/create.Wishlist.dto';
import { EditWishlistDto } from './dto/edit.Wishlist.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class wishlistService {
    constructor(
        @Inject('WISHLIST_MODEL')
        private wishlistModel: Model<Wishlist>,
        private jwtService:JwtService,
    ) {}
    hello(message){
        return message;
    }
    private validateToken(token: string): void {
        try {
            this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private validateTokenAndGetUserID(token: string): string {
        try {
            const decodedToken = this.jwtService.verify(token);
            return decodedToken.id; // Assuming token contains user ID
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    async createWishlist(CreateWishlistDto: CreateWishlistDto): Promise<Wishlist> {
        const newProduct = new this.wishlistModel(CreateWishlistDto);
        return await newProduct.save();
    }

    async getWishlist(token: string): Promise<string> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        const products = await this.wishlistModel.find({ UserID: userID }).exec(); // Filter Wishlist items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateWishlist(token: string, update: any): Promise<any> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        return this.wishlistModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }

    async editWishlist(token: string, EditWishlistDto: EditWishlistDto): Promise<Wishlist> {

        this.validateToken(token);
        const WishlistId = this.validateTokenAndGetUserID(token);
        return await this.wishlistModel.findOneAndUpdate({ UserID: WishlistId }, EditWishlistDto, { new: true });

    }

    async deleteWishlist(token: string): Promise<any> {
        try {
            this.validateToken(token);
            const userID = this.validateTokenAndGetUserID(token);
            const result = await this.wishlistModel.updateOne({ UserID: userID }, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating Wishlist:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    }

}
