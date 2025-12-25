import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserValidator {
  static mustMatch(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isMatching =
        control.parent &&
        control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value;

      return isMatching ? null : { matching: true };
    };
  }
}
