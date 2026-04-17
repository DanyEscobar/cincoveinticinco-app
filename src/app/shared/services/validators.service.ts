import { Injectable } from '@angular/core';
import { AsyncValidatorFn, ValidatorFn, Validators } from '@angular/forms';
import { validateAge } from '@shared/validators/validations';

@Injectable({providedIn: 'root'})
export class ValidatorsService {

  bindValidations( validations: Record<string, string | number | boolean> ) {
    const validList: ValidatorFn[] = [];
    Object.keys( validations ).forEach( key => {
      if ( key === 'required' ) {
        validList.push( Validators.required );
      }
      if ( key === 'email' ) {
        validList.push( Validators.email );
      }
      if ( key === 'minLength' ) {
        validList.push( Validators.minLength( validations[key] as number ) );
      }
      if ( key === 'maxLength' ) {
        validList.push( Validators.maxLength( validations[key] as number ) );
      }
      if ( key === 'validateAge' ) {
        validList.push( validateAge );
      }
    });
    return Validators.compose( validList );
  }

  // --- ASYNC VALIDATORS ---
  bindAsyncValidations(validations?: Record<string, string | number | boolean> | null): AsyncValidatorFn[] | null {
    if (!validations) return null;
    const list: AsyncValidatorFn[] = [];
    return list.length ? list : null;
  }

  bindValidationsArray( validations: Record<string, string | number | boolean> ) {
    const validList: ValidatorFn[] = [];
    Object.keys( validations ).forEach( () => {
      /* empty */
    });
    return Validators.compose( validList );
  }

}
