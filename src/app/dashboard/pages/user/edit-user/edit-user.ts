import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { DynamicFormConfig } from '@shared/interfaces/dynamic-form.interface';
import { FormConfigService } from '@shared/services/form-config.service';
import { SingletonService } from '@shared/services/singleton.service';
import { UserService } from '@shared/services/user.service';
import { finalize, Subject } from 'rxjs';
import { Option } from '@shared/interfaces/option.interface';
import { ContactFormData } from '@dashboard/interfaces/contact-form.interface';
import { Breadcrumbs } from '@shared/components/breadcrumbs/breadcrumbs';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-edit-user',
  imports: [
    DynamicForm,
    ReactiveFormsModule,
    CommonModule,
    Breadcrumbs,
  ],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser implements OnInit, OnDestroy {

  private readonly formConfigService = inject(FormConfigService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly singletonService = inject(SingletonService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  public userConfig = signal<DynamicFormConfig | null>(null);
  public form!: FormGroup;
  private readonly destroy$ = new Subject<void>();
  public actionType = signal<string>('');
  public userId = signal<string>('');

  constructor() {
    this.getUserConfig();
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

    this.singletonService.updateConfigFields(this.userConfig()!, updateContactConfig);
  }

  changeSelect(value: { event?: string; fieldName: string; value?: string }): void {
    if (value.fieldName === 'country') {
      const isColombia = value.value === 'Colombia';
      
      this.userConfig.update(config => {
        if (!config) return config;
        
        const newFields = config.fields.map(field => {
          // Department visibility
          if (field.name === 'department') {
            const hidden = !isColombia;
            const control = this.formUserConfig.get('department');
            
            if (hidden) {
              control?.setValue(null);
              control?.clearValidators();
              control?.disable();
            } else {
              control?.setValue(null);
              control?.setValidators([Validators.required]);
              control?.enable();
              field.options = this.userService.departments;
            }
            control?.updateValueAndValidity();
            return { ...field, hidden };
          }

          // City updates
          if (field.name === 'city') {
            const control = this.formUserConfig.get('city');
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
      this.userConfig.update(config => {
        if (!config) return config;
        
        const newFields = config.fields.map(field => {
          if (field.name === 'city') {
            const control = this.formUserConfig.get('city');
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

  formReady(): void {
    if (this.userId()) {
      this.getUser(this.userId());
    };
  }

  getUser(id: string): void {
    this.userService.getUserById(Number(id)).subscribe({
      next: (user) => {
        if (user) {
          this.formUserConfig.get('firstname')?.setValue(user.name);
          this.formUserConfig.get('lastname')?.setValue(user.last_name);
          this.formUserConfig.get('email')?.setValue(user.email);
          this.formUserConfig.get('address')?.setValue(user.addres);
          this.formUserConfig.get('house')?.setValue(user.house_apartment);
          this.formUserConfig.get('comments')?.setValue(user.comment);
          this.formUserConfig.get('gender')?.setValue(user.sex);
          this.formUserConfig.get('birthdate')?.setValue(user.date_birthday);
          this.formUserConfig.get('country')?.setValue(user.country);
          this.formUserConfig.get('department')?.setValue(user.Deparment);
          this.formUserConfig.get('city')?.setValue(user.City);
          this.changeSelect({ fieldName: 'country', value: user.country });
          if (user.Deparment) {
            this.changeSelect({ fieldName: 'department', value: user.Deparment });
          }
          this.formUserConfig.get('department')?.setValue(user.Deparment);
          this.formUserConfig.get('city')?.setValue(user.City);
        }
      }
    });
  }

  getUserConfig(): void {
    this.formConfigService.getFormConfig('/form-config/contact-form.json').pipe(
      finalize(() => {
        const id = this.activatedRoute.snapshot.params['id'];
        if (id) {
          this.userId.set(id);
        }
        if (this.userConfig()) {
          this.setOptions(this.userService.genders, 'gender');
          this.setOptions(this.userService.countries, 'country');
        }

        if ( this.router.url.includes( 'edit-user' ) && this.userId() ) {
          this.actionType.set('Editar Usuario');
        } else {
          this.actionType.set('');
        }
      })
    ).subscribe({
      next: (config) => {
        this.userConfig.set(config);
      },
      error: () => { 
        console.error('Error al obtener la configuración del formulario');
      }
    });
  }
  
  handleEvent(event: ContactFormData): void {
    if (event.content) {
      const formValue = event.content;
      const isEdit = !!this.userId();
      const currentId = Number(this.userId());
      
      const userData = {
        id: currentId,
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

      if (isEdit) {
        this.userService.updateUser(userData);
        this.toastService.showSuccess('Usuario actualizado correctamente.');
      } else {
        this.userService.addUser(userData);
        this.toastService.showSuccess('Usuario registrado correctamente.');
      }

      this.router.navigate(['/dashboard/users']);
    }
  }

  get formUserConfig() {
    return this.form.get('userConfig') as FormGroup;
  }

  

}
