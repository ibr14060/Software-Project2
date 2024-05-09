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

    async getCart(token:string): Promise<string> {
        console.log("from service t" + token);
        this.validateToken(token);
        const userIDFromToken = this.validateTokenAndGetUserID(token);
        console.log("Called with UserIDhhghgh:", userIDFromToken);
        const products = await this.cartModel.find({ UserID: userIDFromToken }).exec(); // Filter cart items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateCart(token: string, update: any): Promise<any> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        return this.cartModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }
    async editCart(token: string, id: string, newQuantity: Number): Promise<Cart> {
        this.validateToken(token);
        const userID = this.validateTokenAndGetUserID(token);
        console.log("Called with UserID:", id);
        console.log("Called with UserID:", newQuantity);
        // Extract product ID and quantity from DTO
       // const productID = command.products[0]; // Access the first element of the tuple
       // const quantity = command.products[1]; // Access the second element of the tuple
        console.log("productID: ", id);
        console.log("quantity: ", newQuantity);
        // Construct array in the required format
        const newProductItem = [id, newQuantity];
    
        // Find user's cart and update products array
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
