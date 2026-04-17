import { Injectable } from '@angular/core';
import { DynamicFormConfig } from '@shared/interfaces/dynamic-form.interface';
import { Option } from '@shared/interfaces/option.interface';


@Injectable({providedIn: 'root'})
export class SingletonService {

  mapToOptions<T extends { label: string; value: string | number }>( items: T[] ) {
    return items.map( item => ( { label: item.label, value: item.value } ) );
  }

  updateConfigFields( config: DynamicFormConfig , updates: Partial<Record<string, Option[]>>): void {
    config.fields = config.fields.map( ( field ) => {
      const options = updates[field.name];
      if ( options ) {
        return { ...field, options };
      }
      return field;
    });
  }

}
