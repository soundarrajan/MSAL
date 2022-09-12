import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef
} from '@angular/core';
import { IHeaderGroupParams } from '@ag-grid-community/core';
import { IHeaderGroupAngularComp } from '@ag-grid-community/angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-column-group-header',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgColumnGroupHeaderComponent implements IHeaderGroupAngularComp {
  public params: any;
  public template: TemplateRef<any>;
  public templateContext;

  constructor(private changeDetector: ChangeDetectorRef) {}

  agInit(params: IHeaderGroupParams): void {
    this.params = params;

    this.templateContext = {
      title: params.displayName,
      groupDef: params.columnGroup.getColGroupDef()
    };
    this.template = this.params.ngTemplate;

    this.changeDetector.markForCheck();
  }
}
