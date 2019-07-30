import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { copyIntoClipoard } from '../../utils/clipboard.utils';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[appToClipboard]'
})
export class CopyToClipboardDirective {
  @Input('appToClipboard') value: string;
  @Input() showNotifications: boolean = true;

  @Input() propertyName: string = undefined;
  @Output() addedToClipboard = new EventEmitter<string>();

  constructor(private toastr: ToastrService) {}

  @HostListener('click') onClick(): void {
    this.copyToClipboard(this.value);
  }

  copyToClipboard(value: any): void {
    copyIntoClipoard(value);

    if (this.showNotifications) {
      this.toastr.info(`${this.propertyName || 'Property'} has been copied to clipboard`);
    }

    this.addedToClipboard.emit(this.value);
  }
}
