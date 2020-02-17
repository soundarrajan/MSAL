import { Directive, HostListener, Input } from '@angular/core';
import { MasterSelectorHostComponent } from '@shiptech/core/ui/components/master-selector/master-selector-host.component';
import { CdkPortal } from '@angular/cdk/portal';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef
} from 'primeng/dynamicdialog';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'button[appMasterSelectorTrigger]',
  exportAs: 'masterSelectorTrigger'
})
export class MasterSelectorTriggerDirective {
  public dynamicDialogRef: DynamicDialogRef;

  @Input() masterSelector: CdkPortal;
  @Input() dialogConfig: DynamicDialogConfig;
  @Input() header: string;
  @Input() width: string = '80%';
  @Input() height: string = '80%';

  constructor(private dialogService: DialogService) {}

  @HostListener('click', ['$event'])
  onClick(event: any): void {
    event.preventDefault();
    event.stopPropagation();

    this.dynamicDialogRef = this.dialogService.open(
      MasterSelectorHostComponent,
      {
        width: this.width,
        height: this.height,
        showHeader: true,
        closeOnEscape: true,
        baseZIndex: 500,
        header: this.header,
        ...(this.dialogConfig ?? {}),
        data: {
          // TODO: define dialog config type with prop master portal
          ...(this.dialogConfig?.data ?? {}),
          masterPortal: this.masterSelector
        }
      }
    );
  }

  close(): void {
    this.dynamicDialogRef.close();
  }
}
