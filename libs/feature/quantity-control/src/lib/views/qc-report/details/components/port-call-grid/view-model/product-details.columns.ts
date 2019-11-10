import { Injectable } from '@angular/core';
import { PropName } from '@shiptech/core/utils/decorators/method-name.decorator';
import { QcProductTypeListItemStateModel } from '../../../../../../store/report-view/details/qc-product-type-list-item-state.model';

export interface IPortCallDetailsProps extends QcProductTypeListItemStateModel {
}

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsProps implements IPortCallDetailsProps {
  @PropName productTypeName;
  @PropName productTypeId;

  @PropName robBeforeDeliveryLogBookROB;
  @PropName robBeforeDeliveryMeasuredROB;
  @PropName deliveredQuantityBdnQty;
  @PropName deliveredQuantityMessuredDeliveredQuantity;
  @PropName robAfterDeliveryLogBookROB;
  @PropName robAfterDeliveryMeasuredROB;
}

export enum ProductDetailsColGroupsEnum {
  Products = 'Products',
  RobBeforeDelivery = 'RobBeforeDelivery',
  DeliveredQuantity = 'DeliveredQuantity',
  RobAfterDelivery = 'RobAfterDelivery'
}

export enum ProductDetailsColGroupsLabels {
  Products = 'Products',
  RobBeforeDelivery = 'ROB before Delivery/Discharge',
  DeliveredQuantity = 'Delivered Qty/Discharge Qty',
  RobAfterDelivery = 'ROB after Delivery'
}

export enum ProductDetailsColumns {
  ProductTypeName = 'ProductTypeName',

  LogBookRobBeforeDelivery = 'LogBookRobBeforeDelivery',
  MeasuredRobBeforeDelivery = 'MeasuredRobBeforeDelivery',
  RobBeforeDeliveryDifference = 'RobBeforeDeliveryDifference',

  BdnQty = 'BdnQty',
  MessuredDeliveredQty = 'MessuredDeliveredQty',
  DeliveredQuantityDiffernce = 'DeliveredQuantityDiffernce',

  LogBookRobAfterDelivery = 'LogBookRobAfterDelivery',
  MeasuredRobAfterDelivery = 'MeasuredRobAfterDelivery',
  RobAfterDeliveryDifference = 'RobAfterDeliveryDifference'
}

export enum ProductDetailsColumnsLabels {
  ProductTypeName = '',

  LogBookRobBeforeDelivery = 'Log book ROB',
  MeasuredRobBeforeDelivery = 'Measured ROB (Surveyor)',
  RobBeforeDeliveryDifference = 'Difference',

  BdnQty = 'BDN Qty (SUM)',
  MessuredDeliveredQty = 'Measured Delivered Qty',
  DeliveredQuantityDiffernce = 'Difference',

  LogBookRobAfterDelivery = 'Log book ROB',
  MeasuredRobAfterDelivery = 'Measured ROB (Surveyor)',
  RobAfterDeliveryDifference = 'Difference'
}
