import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DynamicFormConfig } from '@shared/interfaces/dynamic-form.interface';

@Injectable({
  providedIn: 'root'
})
export class FormConfigService {

  private readonly http = inject(HttpClient)

  getFormConfig(url: string) {
    return this.http.get<DynamicFormConfig>(url);
  }

}
