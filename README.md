# angular-template-forms-contacts-demo

A demonstration application that showcases Angular's template-driven forms through a small contact management system.

This repository is intended as a learning example for building forms using Angular's template-driven approach while using the in-memory web API for a local demo data source and Angular Material for a consistent, accessible UI.

---

## Features

- Contacts list with Create / Read / Update / Delete (CRUD) operations
- Template-driven forms using `ngModel`, `ngForm` and template references
- Form validation (required fields, email pattern, min/max lengths)
- Angular Material components for layout, inputs, buttons, dialogs and snackbars
- In-memory Web API to simulate a REST backend (`/api/contacts`) for quick demos
- Clear separation of UI, services and data layer so you can swap in a real backend
- State management using Angular Signals for a lightweight, reactive local store

---

## Tech stack

- Angular (latest stable; Angular 16+ recommended for Signals)
- Angular Material (for UI components and theming)
- angular-in-memory-web-api (for local demo data)
- TypeScript, RxJS
- Angular Signals (signal(), computed(), effect()) for local state management

---

## Prerequisites

- Node.js (LTS) and npm installed
- (Optional) Angular CLI if you prefer to use `ng` commands globally

If you need the Angular CLI globally:

```cmd
npm install -g @angular/cli
```

---

## Install and run (Windows, cmd.exe)

From the project root directory run:

```cmd
npm install
```

To run the dev server using the Angular CLI:

```cmd
npx ng serve --open
```

Notes:
- `npx ng serve` will use a local or global Angular CLI if available. If you installed the CLI globally, you can run `ng serve --open` instead.
- The app uses the in-memory web API so there's no external backend required for the demo.

---

## State management with Angular Signals

This demo can use Angular Signals as a lightweight, opinionated store for UI state (contacts list, selection, loading / error flags). Signals work well alongside template-driven forms because they keep component templates simple while centralizing state mutation in a small service.

Key ideas:
- Use `signal<T>(initial)` to hold mutable state in a `ContactStore` service.
- Expose readonly signals (or `computed` values) for components to subscribe to.
- Provide imperative methods on the store to load, create, update and delete contacts. These methods call the HTTP `ContactService` and update the signals.
- Use `effect()` for side-effects (e.g., error logging or storing last-modified timestamps).

A minimal `ContactStore` example (illustrative — place this in `src/app/state/contact.store.ts` if you add it):

```ts
import { Injectable, signal, computed } from '@angular/core';
import { Contact } from '../models/contact.model';
import { ContactService } from '../services/contact.service';

@Injectable({ providedIn: 'root' })
export class ContactStore {
  // signals for state
  private _contacts = signal<Contact[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // readonly/computed views
  readonly contacts = this._contacts;
  readonly loading = this._loading;
  readonly error = this._error;
  readonly total = computed(() => this._contacts().length);

  constructor(private api: ContactService) {}

  loadAll() {
    this._loading.set(true);
    this._error.set(null);
    this.api.getAll().subscribe({
      next: (items) => {
        this._contacts.set(items);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.message || 'Failed to load contacts');
        this._loading.set(false);
      }
    });
  }

  add(contact: Partial<Contact>) {
    this._loading.set(true);
    this.api.create(contact as Contact).subscribe({
      next: (created) => {
        this._contacts.update(list => [...list, created]);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.message || 'Create failed');
        this._loading.set(false);
      }
    });
  }

  update(updated: Contact) {
    this._loading.set(true);
    this.api.update(updated).subscribe({
      next: (saved) => {
        this._contacts.update(list => list.map(c => c.id === saved.id ? saved : c));
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.message || 'Update failed');
        this._loading.set(false);
      }
    });
  }

  remove(id: number) {
    this._loading.set(true);
    this.api.delete(id).subscribe({
      next: () => {
        this._contacts.update(list => list.filter(c => c.id !== id));
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.message || 'Delete failed');
        this._loading.set(false);
      }
    });
  }
}
```

How components consume the store:

```html
<!-- in a template -->
<ul *ngIf="!contactStore.loading()">
  <li *ngFor="let c of contactStore.contacts()">{{ c.firstName }} {{ c.lastName }}</li>
</ul>
```

And in the component class you can inject the store and call methods directly:

```ts
constructor(public contactStore: ContactStore) {}

ngOnInit() {
  this.contactStore.loadAll();
}
```

Notes & guidance:
- Signals require Angular 16+. If your project targets an older Angular version, use RxJS-based stores (BehaviorSubject/Observables) instead.
- Keeping side-effects (HTTP calls) inside the store keeps components simpler and makes the app easier to reason about.
- The store example above cooperates with the `ContactService` (which still uses HttpClient). The store updates signals when the service responses arrive.

---

## What you'll see

- A contacts list built with Angular Material table/cards.
- A form to add or edit contacts implemented with template-driven forms.
- Client-side validation on the form controls and helpful visual feedback.
- Typical UX patterns (confirmation dialogs for deletes, snackbars for saved/deleted messages).

---

## Quick developer notes

Contract (what the app expects):
- HTTP endpoint used by the app: `/api/contacts` (provided by `angular-in-memory-web-api` in dev)
- Contact shape (example):
  - id: number
  - firstName: string
  - lastName: string
  - email: string
  - phone?: string

Edge cases considered:
- Empty or partially-filled forms — form validation prevents invalid submissions.
- Duplicate ids — in-memory API will auto-assign ids for created items in most demo setups.
- Network errors — service should map and surface errors to the UI (snackbars/messages).

Where to look in the code (common places in an Angular demo):
- `src/app/contacts` — components for list, detail/edit and contact form (template-driven)
- `src/app/services/contact.service.ts` — service that calls the API (`HttpClient`)
- `src/app/in-memory-data.service.ts` — demo data provider used by `angular-in-memory-web-api`
- `src/styles.css` or `src/styles.scss` — global styles and Material theme overrides

---

## Switching from in-memory API to a real backend

1. Replace or remove the `InMemoryWebApiModule.forRoot(...)` import in `AppModule`.
2. Configure your real API base URL in the contact service (or an environment config):
   - Example: switch calls to `environment.apiUrl + '/contacts'`.
3. Ensure your real backend matches the expected REST contract (GET/POST/PUT/DELETE at `/contacts`).
4. Remove the demo data file or keep it behind a feature flag for offline demos.

---

## Angular Material theming and customization

The project uses Angular Material for components and theming. To change the theme:

- Edit the Material theme import in `styles.scss`/`styles.css` or update the `@angular/material` setup made by `ng add @angular/material`.
- Swap prebuilt themes or create a custom theme using Angular Material's theming API.

To add (or re-add) Angular Material to the project:

```cmd
npx ng add @angular/material
```

or (manual install):

```cmd
npm install @angular/material @angular/cdk @angular/animations
```

---

## Testing

This demo has no specialized tests by default. To run Angular's default test runner (if the project includes tests):

```cmd
npx ng test
```

You can add unit tests to validate form behavior (e.g., required validators, submit disabled state) and service calls (mocking HttpClient).

---

## Troubleshooting

- If the dev server fails to start, run `npm install` and check the console for missing peer dependencies.
- If the UI looks broken, ensure you imported the Material modules you need in the feature modules.
- If HTTP requests return 404/500, verify whether the in-memory web API is enabled and that the endpoint path matches `/api/contacts`.

---

## Contributing

Small, focused PRs are welcome. Useful contributions:
- More form validation examples (custom validators)
- Accessibility improvements (ARIA labels, keyboard navigation)
- End-to-end tests to document expected UI flows

---

## License

This repository is provided for learning purposes. Use and modify freely; include attribution if you redistribute.

---

If you want, I can also:
- Add a minimal `package.json` and Angular scaffolding files so the project is runnable from scratch, or
- Generate example `src/app` components and services implementing the described demo.

Tell me which you prefer and I will implement it next.
