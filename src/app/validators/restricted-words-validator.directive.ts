import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[restrictedWords]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: RestrictedWordsValidatorDirective,
  }],
})
export class RestrictedWordsValidatorDirective implements Validator {
  @Input() restrictedWords: string[] = [];
  validate(control: AbstractControl): null | ValidationErrors {
    if (!control.value) return null;

    const invalidWords = this.restrictedWords
      .map(w => control.value.includes(w) ? w : null)
      .filter(word => word !== null);

    return invalidWords.length > 0 ? { restrictedWords: invalidWords.join(', ') } : null;
  }
}
