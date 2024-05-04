import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { WishlistService } from 'src/Wishlist/Wishlistservice';
import { CartService } from 'src/cart/Cart.service';
import { OrderService } from 'src/order/Order.service';
@Injectable()
export class AccountService {
    constructor(@Inject('ACC_SERVICE') private readonly accountClient:ClientKafka,
    private readonly cartService:CartService,
    private readonly wishlistService:WishlistService,
    private readonly orderService:OrderService
){}
// b5aly el methods deh tb3t 7agat using kafka ll acc microservice 

  // Adjust the return type to Promise<any>
public hello(): Promise<any> {
    // Return a Promise resolving to the data received from the subscription
    return new Promise((resolve, reject) => {
        // Subscribe to the observable
        this.accountClient.send('hellofromapi', 'hello from api').subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data); // Resolve the Promise with the received data
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error); // Reject the Promise if an error occurs
            }
        });
    });
}

// Adjust the return type to Promise<any>
public register(command: any): Promise<any> {
    
    return new Promise((resolve, reject) => {
  
        this.accountClient.send('register', command).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                const UserID = data.id; 
                console.log("id received:", UserID);
                this.cartService.createCart({ UserID, products:[] }).then((cartData) => {
                    this.wishlistService.createWishlist({ UserID, products:[] }).then((wishlistData) => {
                       
                        this.orderService.createOrder({ UserID, products:[] }).then((orderData) => {
                            resolve({ userData: data, orderData, cartData, wishlistData}); 
                        }).catch((error) => {
                            reject(error); // Reject if an error occurs during cart creation
                        });
                    }).catch((error) => {
                        reject(error); // Reject if an error occurs during cart creation
                    });
                   
                }).catch((error) => {
                    reject(error); // Reject if an error occurs during cart creation
                });
                
               
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error);
            }
        });
    });
}

// Adjust the return type to Promise<any>
public login(command: any): Promise<any> {
    // Return a Promise resolving to the data received from the subscription
    return new Promise((resolve, reject) => {
        // Subscribe to the observable
        this.accountClient.send('login', command).subscribe({
            next: (data) => {
                console.log("Data received:", data);
                resolve(data); // Resolve the Promise with the received data
            },
            error: (error) => {
                console.error("Error:", error);
                reject(error); // Reject the Promise if an error occurs
            }
        });
    });
}

}
