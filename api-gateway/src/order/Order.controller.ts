import { Controller, Request, Get, Inject, OnModuleInit, Post, Param, Delete } from '@nestjs/common';
import { OrderService } from './Order.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('Order')
export class OrderController implements OnModuleInit {

    constructor(
        private orderService: OrderService,
        @Inject('ORDER_SERVICE') private readonly OrderClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.orderService.hello();
    }

    @Post('createOrder')
    async createProduct(@Request() req) {
        console.log(req.body.ProductName +"from api gateway");
        return this.orderService.createOrder(req.body);
    }

    @Get('getOrder/:id') 
    async getOrder(@Param('id') id: string) {
        console.log(id); // Access the 'id' directly from the route parameters
        return this.orderService.getOrder(id);
    }

    @Post('editOrder/:id') 
    async editOrder(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.orderService.editOrder(id, req.body); // Pass 'id' as a parameter
    }
    
    // For deleteProduct endpoint
    @Delete('deleteOrder/:id') // Define the route parameter ':id'
    async deleteOrder(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.orderService.deleteOrder(id); // Pass 'id' as a parameter
    }

    onModuleInit() {
        this.OrderClient.subscribeToResponseOf('hellofromapi');
        this.OrderClient.subscribeToResponseOf('createOrder');
        this.OrderClient.subscribeToResponseOf('getOrder');
        this.OrderClient.subscribeToResponseOf('editOrder');
        this.OrderClient.subscribeToResponseOf('deleteOrder');
    }
}
