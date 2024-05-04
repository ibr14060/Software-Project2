import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
@Injectable()
export class ProductService {
    constructor(@Inject('PRODUCT_SERVICE') private readonly productsClient: ClientKafka) {}

// Adjust the return type to Promise<any>
public hello(): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.productsClient.send('hellofromapi', 'hello from api').subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
            }
        });
    });
}

// Adjust the return type to Promise<any>
public createProduct(data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.productsClient.send('createProduct', data).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
            }
        });
    });
}


    

    // Adjust the return type to Promise<any>
    public getProducts(): Promise<any> {
           
        return new Promise((resolve, reject) => {
               
            this.productsClient.send('getProducts', '').subscribe({
                next: (data) => {
                    console.log("Data received:", data);
                    resolve(data);   
                },
                error: (error) => {
                    console.error("Error:", error);
                    reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
                }
            });
        });
    }
    

// Adjust the return type to Promise<any>
public getProductById(id: string): Promise<any> {
   
    return new Promise((resolve, reject) => {
       
        this.productsClient.send('getProductById', { id }).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data); 
            },
            error: (error) => {
                console.error("Error:", error);
                reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
            }
        });
    });
}


// Adjust the return type to Promise<any>
public editProduct(id: string, data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.productsClient.send('editProduct', { id, body: data }).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
            }
        });
    });
}

// Adjust the return type to Promise<any>
public deleteProduct(id: string): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.productsClient.send('deleteProduct', { id }).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(new HttpException(error, HttpStatus.CONFLICT)); // Reject the promise with status code 409
            }
        });
    });
}

}
