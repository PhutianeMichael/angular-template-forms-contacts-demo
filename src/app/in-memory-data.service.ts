import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const contacts: Contact[] = [
      { id: 1, firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', phone: '555-0101' },
      { id: 2, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', phone: '555-0202' },
      { id: 3, firstName: 'Carol', lastName: 'Clark', email: 'carol@example.com', phone: '555-0303' }
    ];
    return { contacts };
  }

  // Optional: ensure newly created items get a numeric id
  genId(contacts: Contact[]): number {
    return contacts && contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  }
}

