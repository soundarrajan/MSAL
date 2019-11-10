import { Component, TemplateRef } from '@angular/core';
import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import { IHeaderGroupParams } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-column-group-header',
  template: `
      <ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>
  `,
})
export class AgColumnGroupHeaderComponent implements IHeaderGroupAngularComp {
  public params: any;
  public template: TemplateRef<any>;
  public templateContext;

  agInit(params: IHeaderGroupParams): void {
    this.params = params;

    this.templateContext = {
      title: params.displayName,
      groupDef: params.columnGroup.getColGroupDef()
    };
    this.template = this.params.ngTemplate;
  }
}
