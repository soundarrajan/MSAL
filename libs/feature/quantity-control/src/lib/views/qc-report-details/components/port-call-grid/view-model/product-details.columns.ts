import { Injectable } from '@angular/core';
import { IQcReportDetailsProductDto } from '../../../../../services/api/dto/qc-report-details.dto';
import { PropName } from '@shiptech/core/utils/decorators/method-name.decorator';

export interface IPortCallDetailsProps extends IQcReportDetailsProductDto {
}

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsProps implements IPortCallDetailsProps {
  @PropName productTypeName;
  @PropName productTypeId;
  @PropName robBeforeDelivery;
  @PropName deliveredQty;
  @PropName robAfterDelivery;
}

export enum ProductDetailsColGroups {
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
