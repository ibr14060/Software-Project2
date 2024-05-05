import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Cart } from './interfaces/Cart';
import { CreateCartDto } from './dto/create.Cart.dto';
import { EditCartDto } from './dto/edit.cart.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class CartService {
    constructor(
        @Inject('CART_MODEL')
        private cartModel: Model<Cart>,
        private jwtService:JwtService,
    ) {}
    hello(message){
        return message;
    }
    async createCart(CreateCartDto: CreateCartDto): Promise<Cart> {
        const newProduct = new this.cartModel(CreateCartDto);
        return await newProduct.save();
    }

    async getCart(userID: string): Promise<string> {
        const products = await this.cartModel.find({ UserID: userID }).exec(); // Filter cart items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateCart(userID: string, update: any): Promise<any> {
        return this.cartModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }

    async editCart(userID: mongoose.Schema.Types.ObjectId , EditCartDto: EditCartDto): Promise<Cart> {
        return await this.cartModel.findOneAndUpdate({ UserID: userID }, EditCartDto, { new: true });
    }

    async deleteCart(userID: string): Promise<any> {
        try {
            const result = await this.cartModel.updateOne({ UserID: userID }, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating cart:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    }

}
