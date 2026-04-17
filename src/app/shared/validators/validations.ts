import { AbstractControl, ValidationErrors } from "@angular/forms";


export const validateEmail = ( control: AbstractControl ): ValidationErrors | null => {

  const value = String(control?.value ?? '');
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if ( value && !emailRegex.test( value ) ) {
    return {
      emailPattern: true
    };
  }
  return null;
}

export const validateAge = ( control: AbstractControl ): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    
    let age = today.getFullYear() - selectedDate.getFullYear();
    const m = today.getMonth() - selectedDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    
    return age < 18 ? { underAge: true } : null;
  }

