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
  title = "Add Contact";
  @ViewChild("mymodal", { read: TemplateRef, static: true }) modalContent: TemplateRef<any>;
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
    this.addContactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      status: ["true", Validators.required],
      id: ['']
    });
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      windowClass: 'add-user-modal',
      size: 'md',
      keyboard: false
    }
  }

  ngOnInit() {
    this.getContactList();
  }

  getContactList() {
    this.spinner.show();
    this.contactService.getContacts().subscribe((data: any[]) => {
      this.contactInfo = data;
      this.spinner.hide();
    })
  }



  get f() {
    return this.addContactForm.controls;
  }

  addContact() {
    this.title = 'Add Contact';
    this.openContactPopup();
  }
  onSubmit() {
    this.submitted = true;
    if (this.addContactForm.invalid) {
      return;
    }
    this.spinner.show();
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
  public deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(contactId).subscribe((ret) => {
        this.getContactList();
        alert('Contact deleted successfully!')
      })
    }

  }

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

  close() {
    this.submitted = false;
    this.addContactForm.reset({ status: "true" });
    this.modalRef.close();
  }

}
