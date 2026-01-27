import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CommonValidator {
  static isNumber: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return isNaN(control.value) ? { invalidNumber: true } : null;
  };
  static dateRange(
    startDateFormControlName: string,
    endDateFormControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.get(startDateFormControlName)?.value;
      const endDate = control.get(endDateFormControlName)?.value;
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { invalidDateRange: true };
      }
      return null;
    };
  }
}
