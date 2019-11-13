export interface IQcOrderProductsListItemDto {
  orderId: number;
  orderNo: string;
  counterpartyId: number;
  counterpartyName: string;
  productId: number;
  productName: string;
  confirmedQuantity: number;
  uomName: string;
}
