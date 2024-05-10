import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './interfaces/Product';
import { CreateProductDto } from './dto/create.Product.dto';
import { EditProductDto } from './dto/edit.Product.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ProductService {
    constructor(
        @Inject('PRODUCT_MODEL')
        private productModel: Model<Product>,
        private jwtService:JwtService,
    ) {}
    hello(message){
        return message;
    }
    private validateToken(token: string): void {
        try {
            this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private validateTokenAndGetUserID(token: string): string {
        try {
            const decodedToken = this.jwtService.verify(token);
            return decodedToken.id; // Assuming token contains user ID
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = new this.productModel(createProductDto);
        return await newProduct.save();
    }

    async getProducts( token : string): Promise<string> {
        this.validateToken(token);
        const products = await this.productModel.find().exec();
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async getProductById(productId: string ,token : string): Promise<Product> {
        console.log(productId);
        console.log("ss");
        console.log(token);
        this.validateToken(token);
        return (await this.productModel.findById(productId).exec()).toJSON();
    }
    async editProduct(productId: string, token : string , EditProductDto: EditProductDto): Promise<Product> {
        console.log(token);
        this.validateToken(token);
        return await this.productModel.findByIdAndUpdate(productId, EditProductDto, { new: true });
    }

    async deleteProduct(productId: string, token : string): Promise<Product> {
        this.validateToken(token);
        return await this.productModel.findByIdAndDelete(productId);
    }
}
