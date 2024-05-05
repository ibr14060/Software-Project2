import { Inject, Injectable } from '@nestjs/common';
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
    async createWishlist(CreateWishlistDto: CreateWishlistDto): Promise<Wishlist> {
        const newProduct = new this.wishlistModel(CreateWishlistDto);
        return await newProduct.save();
    }

    async getWishlist(userID: string): Promise<string> {
        const products = await this.wishlistModel.find({ UserID: userID }).exec(); // Filter Wishlist items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateWishlist(userID: string, update: any): Promise<any> {
        return this.wishlistModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }

    async editWishlist(WishlistId: string, EditWishlistDto: EditWishlistDto): Promise<Wishlist> {
        
        return await this.wishlistModel.findOneAndUpdate({ UserID: WishlistId }, EditWishlistDto, { new: true });

    }

    async deleteWishlist(userID: string): Promise<any> {
        try {
            const result = await this.wishlistModel.updateOne({ UserID: userID }, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating Wishlist:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    }

}
