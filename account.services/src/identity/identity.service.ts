import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Identity } from './interfaces/identity';
import { CreateIdentityDto } from './dto/create.identity.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
@Injectable()
export class IdentityService {
    emailService: any;
    

    constructor(
        @Inject('IDENTITY_MODEL')
        private identityModel: Model<Identity>,
        private jwtService:JwtService,
       
        ) {}

    hello(message){
        return message;
    }

    async register(CreateIdentityDto:CreateIdentityDto){
        const createIdentity= new this.identityModel(CreateIdentityDto)
        let saveResult = await createIdentity.save();
        console.log(saveResult)
       
        return saveResult;
    }

    async validateUser(loginDto:LoginDto){
        let loginResult =await this.identityModel.findOne({
            username:loginDto.username,
            password:loginDto.password,
        });
        console.log(loginResult +"mwgoda");
        let jsonData =loginResult.toObject();
        let {__v, _id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }

    async getUserbyUsername(username:string){
        let loginResult =await this.identityModel.findOne({
            username:username,
           
        });

        if(loginResult===null){
            return null;
        }
        let jsonData =loginResult.toObject();
        let {__v, _id, ...userData}=jsonData;

        return {
            id:jsonData._id,
            ...userData
        }
    }
    async login(user: any) {
        // Validate user credentials
        const validatedUser = await this.validateUser(user);
    
        if (validatedUser) {
            // User is validated, generate JWT token
            const payload = {
                id: validatedUser.id,
                First_Name: validatedUser.First_Name,
                username: validatedUser.username
            };
            console.log(payload);
            const token = this.jwtService.sign(payload);
            const tokenvalue: any = this.jwtService.decode(token);
    console.log(tokenvalue);
    console.log(token);
            return {
                access_token: token,
                expires_in: tokenvalue.exp
            };
        } else {
            // User validation failed, return null or handle the error accordingly
            return null;
        }
    }
    
}
