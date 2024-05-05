import { Controller, Request, Get, Inject, OnModuleInit, Post, Param, Delete } from '@nestjs/common';
import { ProfileService } from './Profile.service';
import { ClientKafka } from '@nestjs/microservices';
import mongoose from 'mongoose';

@Controller('profile')
export class ProfileController implements OnModuleInit {

    constructor(
        private profileService: ProfileService,
        @Inject('PROFILE_SERVICE') private readonly profileClient: ClientKafka
    ) {}

    @Get('hello')
    getHello(): any {
        return this.profileService.hello();
    }

    @Post('createprofile')
    async createprofile(@Request() req) {
        console.log(req.body.profileName +"from api gateway");
        return this.profileService.createprofile(req.body);
    }



    @Get('getprofiles/:id') 
    async getprofileById(@Param('id') id: mongoose.Schema.Types.ObjectId) {
        console.log(id); // Access the 'id' directly from the route parameters
        return this.profileService.getprofileById(id);
    }

    @Post('editprofile/:id') 
    async editprofile(@Param('id') id: string, @Request() req) {
        console.log(req.body);
        return this.profileService.editprofile(id, req.body); // Pass 'id' as a parameter
    }


    onModuleInit() {
        this.profileClient.subscribeToResponseOf('hellofromapi');
        this.profileClient.subscribeToResponseOf('createprofile');
        this.profileClient.subscribeToResponseOf('getprofiles');
        this.profileClient.subscribeToResponseOf('getprofileById');
        this.profileClient.subscribeToResponseOf('editprofile');
     
    }
}
