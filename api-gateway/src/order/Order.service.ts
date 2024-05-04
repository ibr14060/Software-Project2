import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Observable } from 'rxjs';
@Injectable()
export class OrderService {
    constructor(@Inject('ORDER_SERVICE') private readonly orderClient: ClientKafka) {}

// Adjust the return type to Promise<any>
public hello(): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.orderClient.send('hellofromapi', 'hello from api').subscribe({
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
public createOrder(data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.orderClient.send('createOrder', data).subscribe({
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
public getOrder(id: string): Promise<any> {
   
    return new Promise((resolve, reject) => {
       
        this.orderClient.send('getOrder', id ).subscribe({
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
public editOrder(id: string, data: any): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.orderClient.send('editOrder', { id, body: data }).subscribe({
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
public deleteOrder(id: string): Promise<any> {
       
    return new Promise((resolve, reject) => {
           
        this.orderClient.send('deleteOrder', id ).subscribe({
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
