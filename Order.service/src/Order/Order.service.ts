import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './interfaces/Order';
import { CreateOrderDto } from './dto/create.Order.dto';
import { EditOrderDto } from './dto/edit.Order.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class OrderService {
    constructor(
        @Inject('ORDER_MODEL')
        private orderModel: Model<Order>,
        private jwtService:JwtService,
    ) {}
    hello(message){
        return message;
    }
    async createOrder(CreateOrderDto: CreateOrderDto): Promise<Order> {
        const newProduct = new this.orderModel(CreateOrderDto);
        return await newProduct.save();
    }

    async getOrder(userID: string): Promise<string> {
        const products = await this.orderModel.find({ UserID: userID }).exec(); // Filter Order items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateOrder(userID: string, update: any): Promise<any> {
        return this.orderModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }

    async editOrder(OrderId: string, EditOrderDto: EditOrderDto): Promise<Order> {
        return await this.orderModel.findByIdAndUpdate(OrderId, EditOrderDto, { new: true });
    }

    async deleteOrder(userID: string): Promise<any> {
        try {
            const result = await this.orderModel.updateOne({ UserID: userID }, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating order:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    }

}
