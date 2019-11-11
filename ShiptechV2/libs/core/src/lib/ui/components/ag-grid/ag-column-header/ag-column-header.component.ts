import { Component, TemplateRef } from '@angular/core';
import { IHeaderAngularComp, IHeaderGroupAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IHeaderGroupParams } from 'ag-grid-community';
import { HeaderRendererConfig } from '@shiptech/core/ui/components/ag-grid/type.definition';

export interface IAgColumnHeaderParams extends Partial<ICellRendererParams> {
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-column-header',
  template: `
      <ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>
  `
})
export class AgColumnHeaderComponent implements IHeaderAngularComp {
  public params: any;
  public template: TemplateRef<any>;
  public templateContext;


  static withParams(params: IAgColumnHeaderParams): HeaderRendererConfig {
    return {
      headerComponentFramework: AgColumnHeaderComponent,
      headerComponentParams: params
    };
  }

  agInit(params: IAgColumnHeaderParams): void {
    this.params = params;

    this.templateContext = {
    };
    this.template = this.params.ngTemplate;
  }
}
