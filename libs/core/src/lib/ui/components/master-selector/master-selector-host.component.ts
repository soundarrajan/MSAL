import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { CdkPortal } from '@angular/cdk/portal';

@Component({
  template: '<ng-template [cdkPortalOutlet]="masterPortal"></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterSelectorHostComponent implements OnInit {

  masterPortal: CdkPortal;

  constructor(public dialogRef: DynamicDialogRef,
              public config: DynamicDialogConfig) {

    this.masterPortal = config.data.masterPortal;
  }

  ngOnInit(): void {
  }
}
