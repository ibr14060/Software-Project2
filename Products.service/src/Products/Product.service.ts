import { Inject, Injectable } from '@nestjs/common';
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
    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = new this.productModel(createProductDto);
        return await newProduct.save();
    }

    async getProducts(): Promise<string> {
        const products = await this.productModel.find().exec();
        // Serialize each product to JSON format for logging
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    
    
    

    async getProductById(productId: string): Promise<Product> {
        return await this.productModel.findById(productId).exec();
    }

    async editProduct(productId: string, EditProductDto: EditProductDto): Promise<Product> {
        return await this.productModel.findByIdAndUpdate(productId, EditProductDto, { new: true });
    }

    async deleteProduct(productId: string): Promise<Product> {
        return await this.productModel.findByIdAndDelete(productId);
    }
}
