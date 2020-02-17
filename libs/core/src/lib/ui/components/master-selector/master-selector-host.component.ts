import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  template: '<ng-template [cdkPortalOutlet]="masterPortal"></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterSelectorHostComponent implements OnInit {
  masterPortal: CdkPortal;

  constructor(public config: DynamicDialogConfig) {
    this.masterPortal = config.data.masterPortal;
  }

  ngOnInit(): void {}
}
