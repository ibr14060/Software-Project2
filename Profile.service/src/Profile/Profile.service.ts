import { Inject, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Profile } from './interfaces/Profile';
import { CreateProfileDto } from './dto/create.Profile.dto';
import { EditProfileDto } from './dto/edit.Profile.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ProfileService {
    constructor(
        @Inject('PROFILE_MODEL')
        private profileModel: Model<Profile>,
        private jwtService:JwtService,
    ) {}
    hello(message){
        return message;
    }
    async createprofile(CreateProfileDto: CreateProfileDto): Promise<Profile> {
        const newProduct = new this.profileModel(CreateProfileDto);
        return await newProduct.save();
    }

    async getprofile(userID:  mongoose.Schema.Types.ObjectId): Promise<string> {
        console.log("Called with :", userID);
        const user = await this.profileModel.findById( userID ).exec(); 
        
        console.log(JSON.stringify(user) + " from service s" );
        return JSON.stringify(user);
    }


    async editprofile(profileId: string, EditProfileDto: EditProfileDto): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(profileId, EditProfileDto, { new: true });
    }



}
