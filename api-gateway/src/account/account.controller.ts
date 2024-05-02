import { Controller, Request,Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { ClientKafka } from '@nestjs/microservices';
// bdefine tl api / btae3 el account
@Controller('account') // /account
export class AccountController implements OnModuleInit {

    constructor(private accountServices:AccountService,
        @Inject('ACC_SERVICE') private readonly accountClient:ClientKafka){}
   

    @Get('hello') // /account/hello
    getHello():any{
        return this.accountServices.hello();
    }

    @Post('sign-up')
    async register(@Request() req) {
        console.log(req.body.body); // Log the request body
        return this.accountServices.register({ body: req.body }); // Pass the entire request body to the register method
    }

    @Post('sign-in') // /account/sign-in
    async login(@Request()req){
        console.log(req.body); // Log the request body
        return this.accountServices.login({body:req.body});
    }

    onModuleInit() {
        this.accountClient.subscribeToResponseOf('hellofromapi'); // subscribe to the event
        this.accountClient.subscribeToResponseOf('register'); // subscribe to the event
        this.accountClient.subscribeToResponseOf('login'); // subscribe to the event
    }

}
