import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productsClient: ClientKafka) {}

    public hello() {
        return this.productsClient.send('hellofromapi', 'hello from api').subscribe((data) => console.log(''));
    }

    public createProduct(data: any) {
        console.log(data);
        return this.productsClient.send('createProduct', data).subscribe((data) => console.log(data));
    }

    public getProducts() {
        return this.productsClient.send('getProducts', '').subscribe((data) => console.log(data));
    }

    public getProductById(id: string) {
        console.log(id);
        return this.productsClient.send('getProductById', { id }).subscribe((data) => console.log(data));
    }

    public editProduct(id: string, data: any) {
        console.log(id, data);
        return this.productsClient.send('editProduct', { id, body: data }).subscribe((data) => console.log(data));
    }

    public deleteProduct(id: string) {
        console.log(id);
        return this.productsClient.send('deleteProduct', { id }).subscribe((data) => console.log(data));
    }
}
