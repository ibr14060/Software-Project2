import { Controller, UseGuards } from '@nestjs/common';
import { ProfileService } from './Profile.service';
import { MessagePattern } from '@nestjs/microservices';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import mongoose from 'mongoose';

@Controller('profile')
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @MessagePattern('hellofromapi')
    hello(req) {
        console.log(req);
        return this.profileService.hello(req.data);
    }

    @MessagePattern('createprofile')
    async createprofile(command) {
        console.log(command +"from product controller");
        return this.profileService.createprofile(command);
    }

    @MessagePattern('getprofileById')
    async getprofile(userID:  mongoose.Schema.Types.ObjectId) {
        try {
            console.log("Called with UserID:", userID);
            console.log("Called with UserID:", userID);
            const products = await this.profileService.getprofile(userID);
            return products;
        } catch (error) {
            console.error("Error fetching users:", error);
            return { statusCode: 500, message: "Error fetching products" };
        }
    }
    
    @MessagePattern('editprofile')
    async editprofile(command) {
        console.log(command);
        return this.profileService.editprofile(command.id, command.body);
    }


    

    @UseGuards(JwtAuthGuard)
    @MessagePattern('me')
    async me(command) {
        const { id, ...rest } = command.user;
        return rest;
    }
}
