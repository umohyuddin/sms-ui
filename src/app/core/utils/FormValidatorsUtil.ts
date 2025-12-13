// form-validators.util.ts
import { AbstractControl, FormGroup } from '@angular/forms';

export class FormValidatorsUtil {

  static getErrorMessage(control: AbstractControl | null, validationMessages: any): string {
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      if (validationMessages[error]) {
        return validationMessages[error];
      }
    }
    return '';
  }

  // Optional: whitespace validator
  static noWhitespaceValidator(control: AbstractControl) {
    if (control && control.value && !control.value.trim()) {
      return { whitespace: true };
    }
    return null;
  }

  // Optional: get control from form group safely
  static getControl(form: FormGroup, controlName: string): AbstractControl | null {
    return form.get(controlName);
  }
}
