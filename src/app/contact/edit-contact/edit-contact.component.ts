import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../services/contacts.service';
import { addressTypeValues, Contact, phoneTypeValues } from '../models/contact.model';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { delay, Subscription } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestrictedWordsValidatorDirective } from '../../validators/restricted-words-validator.directive';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgOptimizedImage,
    RestrictedWordsValidatorDirective,
  ],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactsService = inject(ContactsService);
  subs: Subscription[] = [];
  currentContact: Contact = {
    id: '',
    personal: false,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    favoritesRanking: 0,
    address: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      addressType: '',
    },
    phone: {
      phoneNumber: '',
      phoneType: '',
    },
    notes: ''
  }
  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  // Convert route params to signal
  private routeParams = toSignal(this.route.params, {initialValue: {} as any});

  // Input signals
  private contactId = computed(() => this.routeParams()['id'] as string);

  ngOnInit(): void {
    if (!this.contactId() || this.contactId() === '') return;

    this.subs.push(
      this.contactsService.getContactById(this.contactId()).subscribe(contact => {
        if (contact) {
          this.currentContact = {
            ...contact,
            phone: {
              ...(contact.phone ?? {phoneNumber: '', phoneType: ''}),
            },
            address: {
              ...(contact.address ?? {
                streetAddress: '',
                city: '',
                state: '',
                postalCode: '',
                addressType: '',
              }),
            },
          } as Contact
        }
      }),
    )

  }

  saveContact(contactForm: NgForm) {
    if (contactForm.status === 'INVALID') return;

    this.subs.push(
      this.contactsService
        .saveContact(contactForm.value)
        .pipe(delay(3000))
        .subscribe(() =>
          this.router.navigate(['/contacts'])))
  }

  cancel() {
    this.router.navigate(['/contacts']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  isFormInputValid(formControl: NgModel) {
    return (formControl.touched && formControl.invalid)
  }

  formInputWithError(formControl: NgModel) {
    return (formControl.touched && formControl.invalid) ? 'error' : '';
  }

}
