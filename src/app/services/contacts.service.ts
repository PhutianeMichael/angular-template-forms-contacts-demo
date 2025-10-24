import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Contact } from '../models/contact.model';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  http = inject(HttpClient);

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/contacts').pipe(
      tap(value => console.debug('ContactsService.getContacts emitted:', value)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.getContacts error', error);
        return throwError(() => error);
      })
    );
  }

  getContactById(id: number): Observable<Contact | undefined> {
    return this.http.get<Contact>(`/api/contacts/${id}`).pipe(
      map((contact: Contact) => contact ?? undefined),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.getContacts error', error);
        return throwError(() => error);
      })
    );
  }
}
