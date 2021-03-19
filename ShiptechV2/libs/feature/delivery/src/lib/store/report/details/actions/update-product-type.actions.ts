import { QcProductTypeEditableProps } from '../../../../views/delivery/details/components/port-call-grid/view-model/product-details.view-model';

export class UpdateProductTypeAction {
  static readonly type = '[Qc.Report.Details] - Update product type';

  constructor(
    public productTypeId: number,
    public prop: QcProductTypeEditableProps,
    public value: number
  ) {}

  public log(): any {
    return {
      productTypeId: this.productTypeId,
      prop: this.prop,
      value: this.value
    };
  }
}
