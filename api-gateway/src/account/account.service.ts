import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AccountService {
    constructor(@Inject('ACC_SERVICE') private readonly accountClient:ClientKafka){}
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
    // Return a Promise resolving to the data received from the subscription
    return new Promise((resolve, reject) => {
        // Subscribe to the observable
        this.accountClient.send('register', command).subscribe({
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
