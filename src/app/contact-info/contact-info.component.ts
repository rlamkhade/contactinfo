import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactInfo } from '../contact-info';
import { ContactService } from '../contact.service';
@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @ViewChild("mymodal", { read: TemplateRef, static: true }) modalContent: TemplateRef<any>;

  //default title for popup
  title = "Add Contact";

  modalOptions: NgbModalOptions;
  submitted: boolean = false
  modalRef;
  addContactForm: FormGroup
  contactInfo: ContactInfo[];
  constructor(
    private contactService: ContactService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) {

    //form declaration for add/edit.
    this.addContactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      status: ["true", Validators.required],
      id: ['']
    });

    //override default modal options
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'md',
      keyboard: false
    }
  }

  /**
     * Init default function.
     * @auther Rohit L.
   */
  ngOnInit() {
    this.getContactList();
  }
  /**
       * get contact listing.
       * @auther Rohit L.
     */
  getContactList() {
    this.spinner.show();
    this.contactService.getContacts().subscribe((data: any[]) => {
      this.contactInfo = data;
      this.spinner.hide();
    })
  }


  // getter for easy access to contact form fields.
  get f() {
    return this.addContactForm.controls;
  }
  /**
     *open popup for add contact.
     * @auther Rohit L.
   */
  addContact() {
    this.title = 'Add Contact';
    this.openContactPopup();
  }
  /**
    * Submit add/edit contact form.
    * @auther Rohit L.
  */
  onSubmit() {
    this.submitted = true;
    //return if form is invalid
    if (this.addContactForm.invalid) {
      return;
    }
    this.spinner.show();
    //if current action is Edit Contact then take id form submitted id. And if action is Add Contact then take last id value and +1 in that to get unique id.
    let id = this.title == 'Edit Contact' ? this.f.id.value : this.contactInfo[this.contactInfo.length - 1]['id'] + 1;
    let ContactInfo = { id: id, firstname: this.f.firstName.value, lastname: this.f.lastName.value, phone: this.f.phoneNumber.value, email: this.f.email.value, status: this.f.status.value };
    this.contactService.createContact(ContactInfo, this.title).subscribe((data: any) => {
      this.getContactList();
      this.close();
      this.spinner.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err)
      this.spinner.hide();
    });
  }

  /**
    *Contact details for provided id.
    * @param id - Request contact id
    * @auther Rohit L.
  */
  editContact(id) {
    this.spinner.show();
    this.contactService.getContact(id).subscribe((data: ContactInfo) => {
      this.addContactForm.patchValue({
        firstName: data.firstname,
        lastName: data.lastname,
        email: data.email,
        phoneNumber: data.phone,
        status: data.status,
        id: data.id
      })
      this.title = 'Edit Contact';
      this.openContactPopup();
      this.spinner.hide();
    }, (err: HttpErrorResponse) => {

      console.log(err)
      this.spinner.hide();
    });
  }
  /**
    *Delete contact for provided id.
    * @param id - Request contact id
    * @auther Rohit L.
  */
  public deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(contactId).subscribe((ret) => {
        this.getContactList();
        alert('Contact deleted successfully!')
      })
    }

  }
/**
    * Update status for provided id and status.
    * @param id - Request contact id
    * @param status - Request contact status
    * @auther Rohit L.
  */
  changeStatus(contact: ContactInfo, event) {
    let status = event.target.checked ? "true" : "false";
    contact.status = status
    this.contactService.updateContact(contact).subscribe((data: any) => {
      alert('Status updated successfully!')
      this.getContactList();
      this.spinner.hide();
    }, (err: HttpErrorResponse) => {
      console.log(err)
      this.spinner.hide();
    });
  }

  openContactPopup() {
    this.modalRef = this.modalService.open(this.modalContent, this.modalOptions);
  }
/**
    * Close contact popup and reset contact form.
    * @auther Rohit L.
  */
  close() {
    this.submitted = false;
    this.addContactForm.reset({ status: "true" });
    this.modalRef.close();
  }

}
