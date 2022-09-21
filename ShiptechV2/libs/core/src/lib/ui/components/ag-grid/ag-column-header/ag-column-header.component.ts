import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef
} from '@angular/core';
import { ICellRendererParams, IHeaderParams } from '@ag-grid-community/core';
import { HeaderRendererConfig } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { IHeaderAngularComp } from '@ag-grid-community/angular';

export interface IAgColumnHeaderParams extends Partial<ICellRendererParams> {}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-column-header',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgColumnHeaderComponent implements IHeaderAngularComp {
  public params: any;
  public template: TemplateRef<any>;
  public templateContext;

  constructor(private changeDetector: ChangeDetectorRef) {}

  static withParams(params: IAgColumnHeaderParams): HeaderRendererConfig {
    return {
      headerComponentFramework: AgColumnHeaderComponent,
      headerComponentParams: params
    };
  }

  agInit(params: IAgColumnHeaderParams): void {
    this.params = params;

    this.templateContext = {};
    this.template = this.params.ngTemplate;

    this.changeDetector.markForCheck();
  }

  refresh(params: IHeaderParams): boolean{
    return null;
  }
  
}
