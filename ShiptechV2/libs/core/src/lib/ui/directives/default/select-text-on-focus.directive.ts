import { Directive, HostListener, NgModule } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector:
    'p-autoComplete:not(.disable-focus-select):not([disable-focus-select]), ' +
    'p-spinner:not(.disable-focus-select):not([disable-focus-select]), ' +
    'textarea:not(.disable-focus-select):not([disable-focus-select]), ' +
    'input:not(.disable-focus-select):not([disable-focus-select])',
  host: { 'focus-select': '' }
})
/**
 * Auto select text on focus.
 * IMPORTANT: This directive is auto-applied and you need to be careful when you apply it. You can disable this behavior on specific elements by applying css class .disable-focus-select
 */
export class SelectTextOnFocusDirective {
  constructor() {
  }

  @HostListener('onFocus', ['$event.target'])
  @HostListener('focus', ['$event.target'])
  onFocus(element: HTMLInputElement | HTMLTextAreaElement): void {
    element.select();
  }
}

@NgModule({
  declarations: [
    SelectTextOnFocusDirective
  ],
  exports: [
    SelectTextOnFocusDirective
  ]
})
export class SelectTextOnFocusDirectiveModule {
}
