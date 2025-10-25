import { Routes } from '@angular/router';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { EditContactComponent } from './contact/edit-contact/edit-contact.component';

export const routes: Routes = [
  {path: 'contacts', component: ContactListComponent, title: 'Contacts'},
  {path: 'contacts/edit/:id', component: EditContactComponent, title: 'Contact - edit'},
  {path: 'contacts/edit', component: EditContactComponent, title: 'Contact - edit'},
  {path: '', redirectTo: '/contacts', pathMatch: 'full'},
];
