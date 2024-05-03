import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
@Injectable()
export class CartService {
    constructor(@Inject('CART_SERVICE') private readonly cartClient: ClientKafka) {}

// Adjust the return type to Promise<any>
public hello(): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.cartClient.send('hellofromapi', 'hello from api').subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);  
            }
        });
    });
}

// Adjust the return type to Promise<any>
public createCart(data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.cartClient.send('createCart', data).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);  
            }
        });
    });
}


// Adjust the return type to Promise<any>
public getCart(id: string): Promise<any> {
   
    return new Promise((resolve, reject) => {
       
        this.cartClient.send('getCart', id ).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data); 
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}


// Adjust the return type to Promise<any>
public editCart(id: string, data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.cartClient.send('editCart', { id, body: data }).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);  
            }
        });
    });
}

// Adjust the return type to Promise<any>
public deleteCart(id: string): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.cartClient.send('deleteCart', id ).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data);   
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);  
            }
        });
    });
}

}
