export interface DynamicFormField {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  options?: {label: string; value: string | number}[];
  validations?: Record<string, string | number | boolean>;
  class?: string;
  value?: string | number | boolean | null;
  disabled?: boolean;
  integer?: boolean;
  errors?: FormFieldError[];
  children?: (DynamicFormField | DynamicFormField[])[];
  hidden?: boolean;
}

export interface DynamicFormConfig<T = any> {
  title: string;
  button: {
    message: string,
    icon: string,
    position: string
  };
  fields: DynamicFormField[];
}

export interface FormFieldError {
  error:   string;
  message: string;
}
