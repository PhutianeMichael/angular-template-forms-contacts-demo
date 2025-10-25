import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../models/contact.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-contact-list-item',
  imports: [
    JsonPipe,
  ],
  templateUrl: './contact-list-item.component.html',
  styleUrl: './contact-list-item.component.scss'
})
export class ContactListItemComponent {
  @Input() contact!: Contact;
  @Output() selectedContact = new EventEmitter<Contact>();

}
