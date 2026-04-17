import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, ControlContainer, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormConfig } from '@shared/interfaces/dynamic-form.interface';
import { ValidatorsService } from '@shared/services/validators.service';
import { CommonModule } from '@angular/common';
import { TrimDirective } from '@shared/directives/trim.directive';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TrimDirective,
    ErrorMessage,
  ],
  viewProviders: [
    {
      provide: ControlContainer, useFactory: (): ControlContainer => inject(ControlContainer, {skipSelf: true})
    }
  ],
  templateUrl: './dynamic-form.html',
  styles: [],
})
export class DynamicForm<T = Record<string, unknown>> implements OnInit {

  private readonly fb = inject(FormBuilder);
  public controlContainer = inject(ControlContainer);
  public validatorsService = inject(ValidatorsService);
  private readonly toastService = inject(ToastService);
  public router = inject(Router);

  public actionType = input.required<string>();
  public config = input.required<DynamicFormConfig<T>>();
  public formGroupName = input.required<string>();
  public changeSelectEvent = output<{ event?: string; fieldName: string; value?: string; index?: number; indexMain?: number }>();
  public inputEvent = output<string>();
  public submitEvent = output<{ content: T, name: string }>();
  public formReady = output<void>();
  public cancelEvent = output<void>();
  public base64String = signal<string | null>(null);
  public form!: FormGroup;


  ngOnInit(): void {
    const form = this.createGroup();
    const parentControl = this.parentFormGroup.get( this.formGroupName() );
    if ( parentControl ) {
      form.patchValue( parentControl.value as Record<string, unknown> )
      this.parentFormGroup.setControl( this.formGroupName(), form );
    } else {
      this.parentFormGroup.addControl( this.formGroupName(), form );
    }

    this.form = this.parentFormGroup.get( this.formGroupName() ) as FormGroup;
    this.formReady.emit();
  }

  createGroup() {
    const group = this.fb.group({}, {
      validators: [],
      asyncValidators: [],
    });
    this.config().fields.forEach( ( field ) => {
      if ( field.type === 'title' ) {
        return;
      } else if ( field.type === 'formArray' && Array.isArray( field.children ) ) {
        const array = this.fb.array([], {
          validators: field.validations
            ? this.validatorsService.bindValidationsArray(field.validations)
            : null,
          asyncValidators: field.validations
            ? this.validatorsService.bindAsyncValidations(field.validations)
            : null,
        }) as FormArray;
        field.children.forEach( ( item, index: number ) => {
          if ( !Array.isArray(item) ) {
            const g = this.fb.group({});
            item.children?.forEach( ( f ) => {
              if ( Array.isArray(f) ) return;
              g.addControl( f.name, this.fb.control( {value: f.value ?? null, disabled: f?.disabled ?? false}, this.validatorsService.bindValidations( f.validations! ), this.validatorsService.bindAsyncValidations( f.validations ) ) );
            });
            array.push( g );
          } else {
            array.push( this.fb.control( {value: item[index].value ?? null, disabled: item[index]?.disabled ?? false}, this.validatorsService.bindValidations( item[index].validations! ), this.validatorsService.bindAsyncValidations( item[index].validations ) ) );
          }
        });
        group.addControl( field.name, array );
      } else if ( field.validations ) {
          group.addControl( field.name, this.fb.control( {value: field.value ?? null, disabled: !!field?.disabled}, this.validatorsService.bindValidations( field.validations ), this.validatorsService.bindAsyncValidations( field.validations ) ) );
        } else {
          group.addControl( field.name, this.fb.control( {value: field.value ?? null, disabled: !!field?.disabled} ) );
        }
    });
    return group;
  }

  onSubmit(): void {
    if ( this.form.invalid ) {
      this.form.markAllAsTouched();
      
      const hasUnderAgeError = Object.values(this.form.controls).some(control => control.errors?.['underAge']);
      if (hasUnderAgeError) {
        this.toastService.showWarning('No puedes registrarte si eres menor de edad.');
      }

      const invalidControl = Object.keys( this.form.controls ).find( key => this.form.controls[key].invalid );
      if ( invalidControl ) {
        document.getElementById(invalidControl)?.focus();
      }
      return;
    }
    const formValue = this.form.getRawValue() as T;
    this.submitEvent.emit( {content: formValue, name: this.formGroupName()} );
  }

  changeSelect( event: Event, fieldName: string ): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.changeSelectEvent.emit( { event: event.type, fieldName, value } );
    this.onInput( fieldName );
  }

  onInput( fieldName: string ): void {
    this.inputEvent.emit( fieldName );
  }

  cancel(): void {
    this.cancelEvent.emit();
  }

  get parentFormGroup() {
    return this.controlContainer.control! as FormGroup;
  }
}
