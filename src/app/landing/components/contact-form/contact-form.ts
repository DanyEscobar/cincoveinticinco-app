import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicFormConfig } from '@shared/interfaces/dynamic-form.interface';
import { FormConfigService } from '@shared/services/form-config.service';
import { finalize, Subject } from 'rxjs';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { CommonModule } from '@angular/common';
import { UserService } from '@shared/services/user.service';
import { Router } from '@angular/router';
import { SingletonService } from '@shared/services/singleton.service';
import { Option } from '@shared/interfaces/option.interface';
import { ContactFormData } from '@dashboard/interfaces/contact-form.interface';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-contact-form',
  imports: [
    DynamicForm,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm implements OnInit, OnDestroy {

  private readonly formConfigService = inject(FormConfigService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly singletonService = inject(SingletonService);
  private readonly toastService = inject(ToastService);

  public contactConfig = signal<DynamicFormConfig | null>(null);
  public form!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  public actionType = signal<string>('');

  constructor() {
    this.getContactConfig();
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setOptions(data: Option[], fieldName: string): void {
    const options = this.singletonService.mapToOptions(data);

    const updateContactConfig = {
      [fieldName]: options,
    };

    this.singletonService.updateConfigFields(this.contactConfig()!, updateContactConfig);
  }

  changeSelect( value: { event?: string; fieldName: string; value?: string }): void {
    if (value.fieldName === 'country') {
      const isColombia = value.value === 'Colombia';
      
      this.contactConfig.update(config => {
        if (!config) return config;
        
        const newFields = config.fields.map(field => {
          // Department visibility
          if (field.name === 'department') {
            const hidden = !isColombia;
            const control = this.formContactConfig.get('department');
            
            if (hidden) {
              control?.setValue(null);
              control?.clearValidators();
              control?.disable();
            } else {
              control?.setValidators([Validators.required]);
              control?.enable();
              field.options = this.userService.departments;
            }
            control?.updateValueAndValidity();
            return { ...field, hidden };
          }

          // City updates
          if (field.name === 'city') {
            const control = this.formContactConfig.get('city');
            if (!isColombia && value.value) {
              // International flow: Enable city immediately
              field.options = this.userService.cities[value.value] || [];
              control?.setValue(null);
              control?.setValidators([Validators.required]);
              control?.enable();
            } else {
              // Colombia flow or no selection: Disable city until department is chosen
              field.options = [];
              control?.setValue(null);
              control?.setValidators([Validators.required]);
              control?.disable();
            }
            control?.updateValueAndValidity();
          }

          return field;
        });

        return { ...config, fields: newFields };
      });
    }

    // Load cities when department changes (Colombia flow)
    this.changeDepartment(value);
  }

  changeDepartment(value: { event?: string; fieldName: string; value?: string }): void {
    if (value.fieldName === 'department' && value.value) {
      this.contactConfig.update(config => {
        if (!config) return config;
        
        const newFields = config.fields.map(field => {
          if (field.name === 'city') {
            const control = this.formContactConfig.get('city');
            field.options = this.userService.cities[value.value!] || [];
            control?.setValue(null);
            control?.addValidators([Validators.required]);
            control?.enable();
            control?.updateValueAndValidity();
          }
          return field;
        });

        return { ...config, fields: newFields };
      });
    }
  }

  getContactConfig(): void {
    this.formConfigService.getFormConfig('/form-config/contact-form.json').pipe(
      finalize(() => {
        if (this.contactConfig()) {
          this.setOptions(this.userService.genders, 'gender');
          this.setOptions(this.userService.countries, 'country');
        }
      })
    ).subscribe({
      next: (config) => {
        this.contactConfig.set(config);
      },
      error: () => { 
        console.error('Error al obtener la configuración del formulario');
      }
    });
  }

  handleEvent(event: ContactFormData): void {
    if (event.content) {
      const formValue = event.content;
      
      const newUser = {
        sex: formValue.gender,
        date_birthday: new Date(formValue.birthdate),
        name: formValue.firstname,
        last_name: formValue.lastname,
        email: formValue.email,
        addres: formValue.address,
        house_apartment: formValue.house,
        country: formValue.country,
        Deparment: formValue.department,
        City: formValue.city,
        comment: formValue.comments
      };

      this.userService.addUser(newUser);
      this.toastService.showSuccess('Usuario registrado correctamente.');
      
      this.router.navigate(['/dashboard/users']);
    }
  }

  get formContactConfig() {
    return this.form.get('contactConfig') as FormGroup;
  }

}
