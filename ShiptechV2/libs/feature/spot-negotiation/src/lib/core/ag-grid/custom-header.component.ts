import { Component, ElementRef, ViewChild } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import {
  IAfterGuiAttachedParams,
  IHeaderParams
} from '@ag-grid-community/core';
@Component({
  selector: 'app-custom-header',
  template: `
    <div class="header-checkbox-center checkbox-center ag-checkbox-v2">
      <mat-checkbox
        class="mat-checkbox light-checkbox small preferred mat-accent header-selectAll1 mat-checkbox-checked"
        [(ngModel)]="selected"
      ></mat-checkbox>
    </div>
  `
})
export class CustomHeader implements IHeaderAngularComp {
  public params: IHeaderParams;
  private selected: boolean = false;
  agInit(params: IHeaderParams): void {
    console.log(params);
    this.params = params;
  }
  refresh(params: IHeaderParams): boolean {
    return false;
  }
}
