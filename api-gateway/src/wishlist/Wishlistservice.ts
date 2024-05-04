import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
@Injectable()
export class WishlistService {
    constructor(@Inject('WISHLIST_SERVICE') private readonly WishlistClient: ClientKafka) {}

// Adjust the return type to Promise<any>
public hello(): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.WishlistClient.send('hellofromapi', 'hello from api').subscribe({
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
public createWishlist(data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.WishlistClient.send('createWishlist', data).subscribe({
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
public getWishlist(id: string): Promise<any> {
   
    return new Promise((resolve, reject) => {
       
        this.WishlistClient.send('getWishlist', id ).subscribe({
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
public editWishlist(id: string, data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.WishlistClient.send('editWishlist', { id, body: data }).subscribe({
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
public deleteWishlist(id: string): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.WishlistClient.send('deleteWishlist', id ).subscribe({
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
