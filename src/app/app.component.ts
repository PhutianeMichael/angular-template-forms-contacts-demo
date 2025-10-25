import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ContactsService } from './contact/services/contacts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Contact } from './contact/models/contact.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    NgOptimizedImage,
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  contactsService = inject(ContactsService);
  title = 'angular-template-forms-contacts-demo';

  // Signal for the contacts list — default to an empty array
  contacts = toSignal(this.contactsService.getContacts(), {initialValue: []});

  // Signal for a single contact (example) — default to null until loaded
  contact = toSignal(this.contactsService.getContactById(1), {});

  // trackBy for ngFor to optimize rendering
  trackById(_index: number, item: Contact | null) {
    return item ? item.id : null;
  }
}
