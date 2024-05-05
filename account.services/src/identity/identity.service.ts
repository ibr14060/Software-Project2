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
    async sendEmail(email: string, subject: string, text: string, html: string) {
        try {
            // Create a transporter object using SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'softwarepro753@gmail.com',
                    pass: 'fbrd zjvp eekf nsfg'
                }
            });
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'softwarepro753@gmail.com',
                to: email,
                subject: subject,
                text: text,
                html: html
            });
    
            console.log("Email sent:", info.response);
            return info.response;
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const verificationLink = `http://localhost:4000/verify-email?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'softwarepro753@gmail.com',
                pass: 'fbrd zjvp eekf nsfg',
            },
        });

        await transporter.sendMail({
            from: 'softwarepro753@gmail.com',
            to: email,
            subject: 'Verify Your Email Address',
            text: `Please click the following link to verify your email address: ${verificationLink}`,
            html: `<p>Please click the following link to verify your email address:</p><a href="${verificationLink}">${verificationLink}</a>`,
        });
    }
    ////////////////////////////////////////
    async sendResetPasswordEmail(email: string, newPassword: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'softwarepro753@gmail.com',
                pass: 'fbrd zjvp eekf nsfg',
            },
        });

        await transporter.sendMail({
            from: 'softwarepro753@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Your new password is ${newPassword}. Please change it after logging in.`,
            html: `<p>Your new password is <strong>${newPassword}</strong>. Please change it after logging in.</p>`,
        });
    }

    async resetPassword(email: string): Promise<void> {
        console.log(email);
        
        // Check if the user exists in the database
        const user = await this.identityModel.findOne({ Email: email });
        if (!user) {
            throw new Error("User not found");
        }
    
        // Generate a random password
        const newPassword = Math.random().toString(36).slice(-8);
    
        // Send the new password to the user's email
        await this.sendResetPasswordEmail(email, newPassword);
    
        // Update the user's password in the database
        await this.identityModel.updateOne({ Email: email }, { password: newPassword });
    }
    

    ///////////////////////////////
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
            const email = saveResult.Email.toString();
            const verificationToken = this.jwtService.sign({ email: saveResult.Email });

            // Send verification email
            await this.sendVerificationEmail(email, verificationToken);

           // await this.sendEmail("seifibr753@gmail.com", 'Registration Confirmation', 'Welcome to our platform!', '<p>Thank you for registering with us!</p>');

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
            throw new HttpException('invalid information', HttpStatus.CONFLICT);
        }
    }
    
}
