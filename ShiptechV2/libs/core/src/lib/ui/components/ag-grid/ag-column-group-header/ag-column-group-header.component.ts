import { Component, TemplateRef } from '@angular/core';
import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import { IHeaderGroupParams } from 'ag-grid-community';

@Component({
  selector: 'app-column-group-header',
  template: `
      <ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>
  `,
  styleUrls: ['./ag-column-group-header.component.scss']
})
export class AgColumnGroupHeaderComponent implements IHeaderGroupAngularComp {
  public params: any;
  public template: TemplateRef<any>;
  public templateContext;

  agInit(params: IHeaderGroupParams): void {
    this.params = params;

    // TODO: must discuss why this was here
    // if (params.columnGroup.getPinned()) {
    //   return;
    // }

    this.templateContext = {
      title: params.displayName
    };
    this.template = this.params.ngTemplate;
  }
}
