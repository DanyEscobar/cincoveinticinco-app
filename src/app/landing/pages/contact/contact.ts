import { Component } from '@angular/core';
import { ContactInfo } from '@landing/components/contact-info/contact-info';
import { ContactForm } from '@landing/components/contact-form/contact-form';

@Component({
  selector: 'app-contact',
  imports: [
    ContactInfo,
    ContactForm
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
