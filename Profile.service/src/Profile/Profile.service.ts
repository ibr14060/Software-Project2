import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
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

    async getprofile(userID: string): Promise<string> {
        const products = await this.profileModel.find({ UserID: userID }).exec(); // Filter profile items based on UserID
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async updateprofile(userID: string, update: any): Promise<any> {
        return this.profileModel.updateOne({ UserID: userID }, { $set: { products: [] } }).exec();
    }

    async editprofile(profileId: string, EditProfileDto: EditProfileDto): Promise<Profile> {
        return await this.profileModel.findByIdAndUpdate(profileId, EditProfileDto, { new: true });
    }

    async deleteprofile(userID: string): Promise<any> {
        try {
            const result = await this.profileModel.updateOne({ UserID: userID }, { ProductIDs: [] });
            return result;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error; // Rethrow the error to handle it in the caller
        }
    }

}
