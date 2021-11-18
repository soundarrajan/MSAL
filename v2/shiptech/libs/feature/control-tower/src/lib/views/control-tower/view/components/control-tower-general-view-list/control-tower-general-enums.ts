import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export enum ControlTowerProgressColors {
  new = '#31779a',
  markedAsSeen = '#e8ac55',
  resolved = '#8bae8b'
}

export interface IControlTowerRowPopup {
  differenceType?: ILookupDto;
  quantityControlReport?: any;
  popupType: string;
  title: string;
  vessel: string;
  lab?: string;
  orderId?: string;
  deliveryId?: string;
  port: string;
  portCall?: string;
  measuredQuantityLabel?: string;
  differenceQuantityLabel?: string;
  quantityReportId: string;
  progressId: string;
  productTypeList: [
    {
      productType: string;
      bdnQuantity: string;
      measuredQuantity: number;
      differenceQuantity: number;
      uom: string;
    }
  ];
  changeLog?: [];
  comments?: string;
}
