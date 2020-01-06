import { Directive } from '@angular/core';
import { Spinner } from 'primeng/primeng';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'p-spinner[disable-keys-spin]'
})
export class PSpinnerDisableKeysSpinDirective {

  constructor(private spinner: Spinner) {
    spinner.onInputKeydown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    };
  }

}
