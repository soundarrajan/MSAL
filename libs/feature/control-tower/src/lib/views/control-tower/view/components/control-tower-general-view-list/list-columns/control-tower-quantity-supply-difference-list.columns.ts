export enum ControlTowerQuantitySupplyDifferenceListColumns {
  order = 'order',
  orderProductId = 'orderProductId',
  delivery = 'delivery',
  invoice = 'invoice',
  sellerInvoiceNo = 'sellerInvoiceNo',
  documentNo = 'documentNo',
  customStatus = 'customStatus',
  orderProductStatus = 'orderProductStatus',
  buyer = 'buyer',
  supplier = 'supplier',
  orderPhysicalSupplier = 'orderPhysicalSupplier',
  invoicePhysicalSupplier = 'invoicePhysicalSupplier',
  vessel = 'vessel',
  vesselCode = 'vesselCode',
  carrierCompany = 'carrierCompany',
  paymentCompany = 'paymentCompany',
  port = 'port',
  eta = 'eta',
  deliveryDate = 'deliveryDate',
  line = 'line',
  agreementType = 'agreementType',
  product = 'product',
  invoiceQuantity = 'invoiceQuantity',
  price = 'price',
  sumOfCosts = 'sumOfCosts',
  invoiceAmount = 'invoiceAmount',
  invoiceProductAmount = 'invoiceProductAmount',
  totalInvoiceProductAmount = 'totalInvoiceProductAmount',
  invoiceCurrency = 'invoiceCurrency',
  orderProduct = 'orderProduct',
  confirmedQuantity = 'confirmedQuantity',
  finalQuantityAmount = 'finalQuantityAmount',
  orderPrice = 'orderPrice',
  orderPriceCurrency = 'orderPriceCurrency',
  convertedCurrency = 'convertedCurrency',
  invoiceProductAmountInOrderCurrency = 'invoiceProductAmountInOrderCurrency',
  orderCost = 'orderCost',
  orderProductAmount = 'orderProductAmount',
  totalOrderProductAmount = 'totalOrderProductAmount',
  orderAmount = 'orderAmount',
  orderCurrency = 'orderCurrency',
  invoiceStatus = 'invoiceStatus',
  dueDate = 'dueDate',
  workingDueDate = 'workingDueDate',
  approvedDate = 'approvedDate',
  accountNumber = 'accountNumber',
  paymentDate = 'paymentDate',
  backOfficeComments = 'backOfficeComments',
  claimNo = 'claimNo',
  claimDate = 'claimDate',
  claimStatus = 'claimStatus',
  actualSettlementDate = 'actualSettlementDate',
  debunkerAmount = 'debunkerAmount',
  resaleAmount = 'resaleAmount',
  invoiceType = 'invoiceType',
  receivedDate = 'receivedDate',
  sellerDueDate = 'sellerDueDate',
  orderStatus = 'orderStatus',
  contractId = 'contractId',
  productType = 'productType',
  fuelPriceItemDescription = 'fuelPriceItemDescription',
  invoiceApprovalStatus = 'invoiceApprovalStatus'
}

export enum ControlTowerQuantitySupplyDifferenceListColumnsLabels {
  order = 'Order No',
  orderProductId = 'Order Product ID',
  delivery = 'Delivery No',
  invoice = 'Invoice No',
  sellerInvoiceNo = 'Seller Invoice No',
  documentNo = 'Document No',
  customStatus = 'Invoice Status',
  orderProductStatus = 'Order Product Status',
  buyer = 'Buyer',
  supplier = 'Seller',
  orderPhysicalSupplier = 'Order Physical',
  invoicePhysicalSupplier = 'Invoice Physical',
  vessel = 'Vessel',
  vesselCode = 'Vessel Code',
  carrierCompany = 'Carrier',
  paymentCompany = 'Payment Company',
  port = 'Port Name',
  eta = 'ETA',
  deliveryDate = 'Delivery Date',
  line = 'Line',
  agreementType = 'Agreement Type',
  product = 'Inv. Product',
  invoiceQuantity = 'Inv. Qty',
  price = 'Inv. Price',
  invoiceProductAmount = 'Inv. Product Amount',
  sumOfCosts = 'Inv. Cost',
  totalInvoiceProductAmount = 'Total Invoice Product Amount',
  invoiceAmount = 'Invoice Amount',
  invoiceCurrency = 'Invoice Currency',
  orderProduct = 'Order Product',
  confirmedQuantity = 'Con Qty',
  finalQuantityAmount = 'Delivered Quantity',
  orderPrice = 'Order Price',
  orderPriceCurrency = 'Order Price Currency',
  invoiceProductAmountInOrderCurrency = 'Inv. Prod. Amount in Ord. Curr.',
  convertedCurrency = 'Converted Currency',
  orderCost = 'Order Cost',
  orderProductAmount = 'Order Product Amount',
  totalOrderProductAmount = 'Total Order Product Amount',
  orderAmount = 'Order Amount',
  orderCurrency = 'Order Currency',
  invoiceStatus = 'Invoice Approval Status',
  dueDate = 'Due Date',
  workingDueDate = 'Working Due Date',
  approvedDate = 'Validate Date',
  accountNumber = 'Account Number',
  paymentDate = 'Payment Date',
  backOfficeComments = 'Back Office Comments',
  claimNo = 'Claim No',
  claimDate = 'Claim Date',
  claimStatus = 'Claim Status',
  actualSettlementDate = 'Actual Agreement Date',
  debunkerAmount = 'Debunker Amount',
  resaleAmount = 'Resale Amount',
  invoiceType = 'Invoice Type',
  receivedDate = 'Invoice Received Date',
  sellerDueDate = 'Seller Due Date',
  orderStatus = 'Order Status',
  contractId = 'Contract ID',
  productType = 'Product Type',
  fuelPriceItemDescription = 'Fuel Price Item Description',
  invoiceApprovalStatus = 'Recon Status'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const ControlTowerQuantitySupplyDifferenceListColumnServerKeys: Record<
  ControlTowerQuantitySupplyDifferenceListColumns,
  string
> = {
  [ControlTowerQuantitySupplyDifferenceListColumns.order]: 'order_id',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderProductId]:
    'orderProductId',
  [ControlTowerQuantitySupplyDifferenceListColumns.delivery]: 'delivery_id',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoice]: 'invoice_id',
  [ControlTowerQuantitySupplyDifferenceListColumns.sellerInvoiceNo]:
    'sellerInvoiceNo',
  [ControlTowerQuantitySupplyDifferenceListColumns.documentNo]: 'documentNo',
  [ControlTowerQuantitySupplyDifferenceListColumns.customStatus]:
    'customStatus_DisplayName',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderProductStatus]:
    'orderProductStatus_DisplayName',
  [ControlTowerQuantitySupplyDifferenceListColumns.buyer]: 'buyer_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.supplier]: 'supplier_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderPhysicalSupplier]:
    'orderPhysicalSupplier_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoicePhysicalSupplier]:
    'invoicePhysicalSupplier_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.vessel]: 'vessel_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.vesselCode]: 'vessel_Code',
  [ControlTowerQuantitySupplyDifferenceListColumns.carrierCompany]:
    'carrierCompany_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.paymentCompany]:
    'paymentCompany_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.port]: 'port_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.eta]: 'eta',
  [ControlTowerQuantitySupplyDifferenceListColumns.deliveryDate]:
    'deliveryDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.line]: 'line_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.agreementType]:
    'agreementType_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.product]: 'product_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceQuantity]:
    'invoiceQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.price]: 'price',
  [ControlTowerQuantitySupplyDifferenceListColumns.sumOfCosts]: 'sumOfCosts',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceAmount]:
    'invoiceAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceProductAmount]:
    'invoiceProductAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.totalInvoiceProductAmount]:
    'totalInvoiceProductAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceCurrency]:
    'invoiceCurrency_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderProduct]:
    'orderProduct_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.confirmedQuantity]:
    'confirmedQuantity',
  [ControlTowerQuantitySupplyDifferenceListColumns.finalQuantityAmount]:
    'finalQuantityAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderPrice]: 'orderPrice',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderPriceCurrency]:
    'orderPriceCurrency_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.convertedCurrency]:
    'convertedCurrency_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceProductAmountInOrderCurrency]:
    'invoiceProductAmountInOrderCurrency',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderCost]: 'orderCost',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderProductAmount]:
    'orderProductAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.totalOrderProductAmount]:
    'totalOrderProductAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderAmount]: 'orderAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderCurrency]:
    'orderCurrency_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceStatus]:
    'invoiceStatus',
  [ControlTowerQuantitySupplyDifferenceListColumns.dueDate]: 'dueDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.workingDueDate]:
    'workingDueDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.approvedDate]:
    'approvedDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.accountNumber]:
    'accountNumber',
  [ControlTowerQuantitySupplyDifferenceListColumns.paymentDate]: 'paymentDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.backOfficeComments]:
    'backOfficeComments',
  [ControlTowerQuantitySupplyDifferenceListColumns.claimNo]: 'claimNo',
  [ControlTowerQuantitySupplyDifferenceListColumns.claimDate]: 'claimDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.claimStatus]:
    'claimStatus_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.actualSettlementDate]:
    'actualSettlementDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.debunkerAmount]:
    'debunkerAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.resaleAmount]:
    'resaleAmount',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceType]:
    'invoiceType_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.receivedDate]:
    'receivedDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.sellerDueDate]:
    'sellerDueDate',
  [ControlTowerQuantitySupplyDifferenceListColumns.orderStatus]:
    'orderStatus_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.contractId]: 'contractId',
  [ControlTowerQuantitySupplyDifferenceListColumns.productType]:
    'productType_Name',
  [ControlTowerQuantitySupplyDifferenceListColumns.fuelPriceItemDescription]:
    'fuelPriceItemDescription',
  [ControlTowerQuantitySupplyDifferenceListColumns.invoiceApprovalStatus]:
    'invoiceApprovalStatus'
};
