import { Injectable } from '@angular/core';
import {
  IPortCallDeliveredQty,
  IPortCallProductDto,
  IPortCallRob
} from '../../../../../services/api/dto/port-call.dto';
import { PropName } from '@shiptech/core/utils/decorators/method-name.decorator';

export interface IPortCallDetailsProps extends IPortCallProductDto {
}

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsProps implements IPortCallDetailsProps {
  @PropName productTypeName: string;
  @PropName productTypeId: number;
  @PropName robBeforeDelivery: IPortCallRob;
  @PropName deliveredQty: IPortCallDeliveredQty;
  @PropName robAfterDelivery: IPortCallRob;
}

export enum ProductDetailsColumns {

}

export enum ProductDetailsColumnsLabels {
}
