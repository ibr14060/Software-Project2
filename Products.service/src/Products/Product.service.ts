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
    async getGuestProducts( ): Promise<string> {

        const products = await this.productModel.find().exec();
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    
    }
    async getGuestCategoryProducts(categoryName : string): Promise<string> {
        const products = await this.productModel.find({ProductCategory : categoryName}).exec();
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async getCategoryProducts(token :string,categoryName:string): Promise<string> {
        this.validateToken(token);
        const products = await this.productModel.find({ProductCategory : categoryName}).exec();
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    
    async getGuestProductById(productId: string ): Promise<Product> {
        console.log(productId);
        console.log("ss");

        return (await this.productModel.findById(productId).exec()).toJSON();
    }

    async getProducts( token : string): Promise<string> {
        this.validateToken(token);
        const products = await this.productModel.find().exec();
        const serializedProducts = products.map(product => product.toJSON());
        console.log(JSON.stringify(serializedProducts) + " from service s" );
        return JSON.stringify(serializedProducts);
    }
    async getUserReviews(token: string): Promise<string> {
        try {
            this.validateToken(token);
            const userId = this.validateTokenAndGetUserID(token);
    console.log(userId + " from service userreviews");
            // Find products that have a review with the user's ID
            const products = await this.productModel.find({ 'ProductsReview.id': userId }).exec();
    console.log(products + " from service userreviews");
            // Serialize products to JSON
            const serializedProducts = products.map(product => product.toJSON());
    
            console.log(JSON.stringify(serializedProducts) + " from service s");
            return JSON.stringify(serializedProducts);
        } catch (error) {
            console.error("Error:", error);
            // Handle errors here
            throw new Error("Failed to fetch user reviews");
        }
    }
    
    async AddReview(productid:string,review: string,token : string ): Promise<Product> {
        this.validateToken(token);
        const userId = this.validateTokenAndGetUserID(token);
        const product = await this.productModel.findById(productid).exec();
        const newReviewItem = { id: userId, review: review }; // Construct as an object

        return await this.productModel.findOneAndUpdate(
            { _id: productid },
            { $push: { ProductsReview: newReviewItem } },
            { new: true, upsert: true }
        );

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
