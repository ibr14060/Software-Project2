import { Controller, UseGuards } from '@nestjs/common';
import { OrderService } from './Order.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @MessagePattern('hellofromapi')
    hello(req) {
        console.log(req);
        return this.orderService.hello(req.data);
    }

    @MessagePattern('createOrder')
    async createOrder(command) {
        console.log(command +"from product controller");
        return this.orderService.createOrder(command);
    }

    @MessagePattern('getOrder')
    async getOrder(userID: string) {
        try {
            console.log("Called with UserID:", userID);
            const products = await this.orderService.getOrder(userID);
            return products;
        } catch (error) {
            console.error("Error fetching products:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
    }
    
    @MessagePattern('editOrder')
    async editOrder(command) {
        console.log(command);
        return this.orderService.editOrder(command.id, command.body);
    }

    @MessagePattern('deleteOrder')
    async deleteOrder(userID: string) {
        try {
            console.log("Called with UserID:", userID);
            const result = await this.orderService.updateOrder(userID, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating Order:", error);
            return { statusCode: 500, message: "Error updating Order" };
        }
    }
    

    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command) {
        const { id, ...rest } = command.user;
        return rest;
    }
}
