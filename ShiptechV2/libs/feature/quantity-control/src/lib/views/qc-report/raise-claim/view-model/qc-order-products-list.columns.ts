import { Injectable } from '@angular/core';
import { PropName } from '@shiptech/core/utils/decorators/method-name.decorator';
import { IQcOrderProductsListItemDto } from '../../../../services/api/dto/qc-order-products-list-item.dto';
import { Omit } from '@shiptech/core/utils/type-definitions';

@Injectable({
  providedIn: 'root'
})
export class QcOrderProductsListItemProps implements Omit<IQcOrderProductsListItemDto, 'counterpartyId' | 'orderId' | 'productId'> {
  @PropName orderNo;
  @PropName counterpartyName;
  @PropName productName;
  @PropName confirmedQuantity;
  @PropName uomName;
}

export enum QcOrderProductsListColumns {
  orderNo = 'OrderNo',
  counterpartyName = 'CounterpartyName',
  productName = 'Product',
  confirmedQuantity = 'ConfirmedQty',
  uomName = 'UOM'
}

export enum QcOrderProductsListColumnsLabels {
  orderNo = 'Order No',
  counterpartyName = 'Counterparty Name',
  productName = 'Product',
  confirmedQuantity = 'Confirmed Qty',
  uomName = 'UOM'
}
