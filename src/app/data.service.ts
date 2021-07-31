import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api'
@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    let contact = [
      { id: 1, firstname: 'Sachin', lastname: "Tendulkar", email: "sachin@gmail.com", phone: "1111111111", status: "true"},
      { id: 2, firstname: 'Virat', lastname: "Kohli", email: "vk@gmail.com", phone: "2222222222", status: "false"}
    ];

    return { contact };

  }
}
