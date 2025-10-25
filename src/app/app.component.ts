import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ContactsService } from './contact/services/contacts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import { Contact } from './contact/models/contact.model';
import { CrudContactsComponent } from './crud-contacts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    CrudContactsComponent,
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
