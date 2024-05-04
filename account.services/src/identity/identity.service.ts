import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Identity } from './interfaces/identity';
import { CreateIdentityDto } from './dto/create.identity.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import * as nodemailer from 'nodemailer';
import { HttpException, HttpStatus } from '@nestjs/common';
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

    async register(CreateIdentityDto: CreateIdentityDto) {
        try {
            // Check if the username already exists in the database
            const existingUser = await this.identityModel.findOne({ username: CreateIdentityDto.username }).exec();
            if (existingUser) {
                // Username already exists, return an error message
                throw new HttpException('Username already exists. Please choose another username.', HttpStatus.CONFLICT);
            }
        
            // Username doesn't exist, proceed with registration
            const createIdentity = new this.identityModel(CreateIdentityDto);
            let saveResult = await createIdentity.save();
            console.log(saveResult);
            console.log(saveResult._id.toString());
            const payload = {
                id: saveResult._id.toString(),
                First_Name: saveResult.First_Name,
                username: saveResult.username,
                email: saveResult.Email
            };
            return payload;
        } catch (error) {
            // Handle any error that occurs during registration
            console.error("Error occurred during registration:", error);
            return { error: 'An error occurred during registration.' };
        }
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
