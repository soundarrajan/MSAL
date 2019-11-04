import { QcProductTypeListItemState } from './qc-product-type-list-item.state';
import { Omit } from '@shiptech/core/utils/type-definitions';

export class UpdateProductTypeAction {
  static readonly type = '[Qc.Report.Details] - Update product type';

  constructor(public productTypeId: number, public prop: keyof Omit<QcProductTypeListItemState, 'productTypeId' | 'productTypeName'>) {
  }

  public log(): any {
    return {
      productTypeId: this.productTypeId
    };
  }
}
