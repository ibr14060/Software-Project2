import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
    async createCart(CreateCartDto: CreateCartDto): Promise<Cart> {
        const newProduct = new this.cartModel(CreateCartDto);
        return await newProduct.save();
    }

    async getCart(token: string): Promise<Cart> {
        console.log("from service t" + token);
        this.validateToken(token);
        const userIDFromToken = this.validateTokenAndGetUserID(token);
        console.log("Called with UserID:", userIDFromToken);

        // Find the cart document based on the user ID
        const cart = await this.cartModel.findOne({ UserID: userIDFromToken }).exec();
console.log(cart);
        if (!cart) {
            // Handle case where no cart is found for the user
            console.log("No cart found for the user");
            return null;
        }

        // Log details of the cart
        console.log("Cart details:");
        console.log(`_id: ${cart._id}`);
        console.log(`UserID: ${cart.UserID}`);
        console.log("Products:");
        return cart.toJSON();
    }
    
    
    async updateCart(token: string, productId: string): Promise<any> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        
        // Find the index of the item with the specified product ID in the products array
        const cart = await this.cartModel.findOne({ UserID: userID }).exec(); // Declare the 'cart' variable
        
        const index = cart.products.findIndex((item: any) => item[0] === productId);
        
        // If the index is found, remove the item from the array
        if (index !== -1) {
            cart.products.splice(index, 1);
        }
    
        // Update the cart document in the database
        return this.cartModel.updateOne({ UserID: userID }, { $set: { products: cart.products } }).exec();
    }
    
    async editCart(token: string, id: string, newQuantity: number): Promise<Cart> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        const newProductItem = { id: id, quantity: newQuantity }; // Construct as an object
        return await this.cartModel.findOneAndUpdate(
            { UserID: userID },
            { $push: { products: newProductItem } },
            { new: true, upsert: true }
        );
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
