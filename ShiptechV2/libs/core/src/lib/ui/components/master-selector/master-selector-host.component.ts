import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/primeng';
import { CdkPortal } from '@angular/cdk/portal';

@Component({
  template: '<ng-template [cdkPortalOutlet]="masterPortal"></ng-template>'
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
