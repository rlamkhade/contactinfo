import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactInfo } from './contact-info';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  SERVER_URL: string = "http://localhost:8080/api/";
  constructor(private httpClient: HttpClient) { }

  public getContacts() {
    return this.httpClient.get(this.SERVER_URL + 'contact');
  }

  public getContact(contactId) {
    return this.httpClient.get(`${this.SERVER_URL + 'contact'}/${contactId}`);
  }
  public createContact(contact: ContactInfo, title) {
    if (title == 'Edit Contact') {
      return this.httpClient.put(`${this.SERVER_URL + 'contact'}/${contact.id}`, contact)
    } else {
      return this.httpClient.post(`${this.SERVER_URL + 'contact'}`, contact)
    }
  }

  public deleteContact(contactId) {
    return this.httpClient.delete(`${this.SERVER_URL + 'contact'}/${contactId}`)
  }
  public updateContact(contact: ContactInfo) {
    return this.httpClient.put(`${this.SERVER_URL + 'contact'}/${contact.id}`, contact)
  }

}