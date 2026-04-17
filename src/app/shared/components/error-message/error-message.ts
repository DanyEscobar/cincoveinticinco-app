import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';

export interface ErrorMsg {
  error: string;
  message: string;
}

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage implements OnInit, OnDestroy {

  public messages = input<ErrorMsg[]>([]);
  public control = input<AbstractControl>();
  public showIcon = input<boolean>(true);
  public errors: ValidationErrors | null | undefined = null;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.control()?.valueChanges.subscribe(() => {
      if (this.control()?.errors) {
        this.errors = this.control()?.errors;
      }
    });
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getParam(value: string) {
    const regex = /\{\{(.*?)\}\}/g;
    const params = value.match(regex);
    if (params) {
      params.forEach((param) => {
        const paramName = param.replace(/\{\{|\}\}/g, '');
        const paramValue = (this.errors?.[paramName] as Record<string, unknown> | undefined)?. ['requiredLength'] as string | number | undefined;
        if (paramValue !== null && paramValue !== undefined) {
          value = value.replace(param, String(paramValue));
        }
      });
    }
    
    return value;
  }

  lz(id: string, fallback: string): string {
    switch (id) {
      case 'required':
        return `${fallback}`;
      case 'min_length':
        return `${fallback}`;
      case 'pattern':
        return `${fallback}`;
      case 'underAge':
        return `${fallback}`;
      default:
        return fallback;
    }
  }
}
