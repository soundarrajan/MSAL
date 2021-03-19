export enum OrderListColumns {
  selection = 'selection',
  order = 'order_id',
  orderDate = 'orderDate',
  product = 'product_name',
  confirmedQuantity = 'confirmedQuantity',
  vessel = 'vessel_name',
  location = 'location_name',
  eta = 'eta',
}

export enum OrderListColumnsLabels {
  order = 'Order No',
  orderDate = 'Order Date',
  product = 'Product Name',
  confirmedQuantity = 'Confirmed Quantity',
  vessel = 'Vessel Name',
  location = 'Location Name',
  eta = 'Eta',
}

export const OrderListColumnServerKeys: Record<
OrderListColumns,
  string
> = {
  [OrderListColumns.selection]: undefined,
  [OrderListColumns.order]: 'order_id',
  [OrderListColumns.orderDate]: 'orderDate',
  [OrderListColumns.product]: 'product_name',
  [OrderListColumns.confirmedQuantity]: 'confirmedQuantity',
  [OrderListColumns.vessel]: 'vessel_name',
  [OrderListColumns.location]: 'location_name',
  [OrderListColumns.eta]: 'eta'
};
