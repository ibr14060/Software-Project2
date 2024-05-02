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

    @Post('sign-up') // /account/sign-up
    async regster(@Request()req){
        return this.accountServices.register({body:req.body.data});
    }

    @Post('sign-in') // /account/sign-in
    async login(@Request()req){
        return this.accountServices.login({body:req.body.data});
    }

    onModuleInit() {
        this.accountClient.subscribeToResponseOf('hellofromapi'); // subscribe to the event
        this.accountClient.subscribeToResponseOf('register'); // subscribe to the event
        this.accountClient.subscribeToResponseOf('login'); // subscribe to the event
    }

}
