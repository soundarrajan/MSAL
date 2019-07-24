import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { copyIntoClipoard } from './clipboard.utils';

@Directive({
  selector: '[appToClipboard]'
})
export class CopyToClipboardDirective {
  @Input('appToClipboard') value: string;
  @Input() showNotifications: boolean = true;

  @Input() propertyName: string = undefined;
  @Output() addedToClipboard = new EventEmitter<string>();

  constructor(private snackBar: MatSnackBar) {}

  @HostListener('click') onClick(): void {
    this.copyToClipboard(this.value);
  }

  copyToClipboard(value: any): void {
    copyIntoClipoard(value);

    if (this.showNotifications) {
      this.snackBar.open(`${this.propertyName || 'Property'} has been copied to clipboard`, 'Close', { duration: 3000 });
    }

    this.addedToClipboard.emit(this.value);
  }
}
