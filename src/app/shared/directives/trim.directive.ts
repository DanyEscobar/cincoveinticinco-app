import { Directive, HostListener, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrim]',
  standalone: true,
})
export class TrimDirective {

  private readonly ng = inject(NgControl);
  private readonly el = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('blur')
  onBlur() {
    const v = this.el.nativeElement.value.replaceAll(/\s+/g, ' ').trim();
    this.ng.control?.setValue(v, { emitEvent: false });
  }
}