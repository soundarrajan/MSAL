export enum ControlTowerQuantityRobDifferenceListColumns {
  actions = 'actions',
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

export enum ControlTowerQuantityRobDifferenceListColumnsLabels {
  actions = 'Actions',
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
export const ControlTowerQuantityRobDifferenceListColumnServerKeys: Record<
  ControlTowerQuantityRobDifferenceListColumns,
  string
> = {
  [ControlTowerQuantityRobDifferenceListColumns.actions]: undefined,
  [ControlTowerQuantityRobDifferenceListColumns.order]: 'order_id',
  [ControlTowerQuantityRobDifferenceListColumns.orderProductId]:
    'orderProductId',
  [ControlTowerQuantityRobDifferenceListColumns.delivery]: 'delivery_id',
  [ControlTowerQuantityRobDifferenceListColumns.invoice]: 'invoice_id',
  [ControlTowerQuantityRobDifferenceListColumns.sellerInvoiceNo]:
    'sellerInvoiceNo',
  [ControlTowerQuantityRobDifferenceListColumns.documentNo]: 'documentNo',
  [ControlTowerQuantityRobDifferenceListColumns.customStatus]:
    'customStatus_DisplayName',
  [ControlTowerQuantityRobDifferenceListColumns.orderProductStatus]:
    'orderProductStatus_DisplayName',
  [ControlTowerQuantityRobDifferenceListColumns.buyer]: 'buyer_Name',
  [ControlTowerQuantityRobDifferenceListColumns.supplier]: 'supplier_Name',
  [ControlTowerQuantityRobDifferenceListColumns.orderPhysicalSupplier]:
    'orderPhysicalSupplier_Name',
  [ControlTowerQuantityRobDifferenceListColumns.invoicePhysicalSupplier]:
    'invoicePhysicalSupplier_Name',
  [ControlTowerQuantityRobDifferenceListColumns.vessel]: 'vessel_Name',
  [ControlTowerQuantityRobDifferenceListColumns.vesselCode]: 'vessel_Code',
  [ControlTowerQuantityRobDifferenceListColumns.carrierCompany]:
    'carrierCompany_Name',
  [ControlTowerQuantityRobDifferenceListColumns.paymentCompany]:
    'paymentCompany_Name',
  [ControlTowerQuantityRobDifferenceListColumns.port]: 'port_Name',
  [ControlTowerQuantityRobDifferenceListColumns.eta]: 'eta',
  [ControlTowerQuantityRobDifferenceListColumns.deliveryDate]: 'deliveryDate',
  [ControlTowerQuantityRobDifferenceListColumns.line]: 'line_Name',
  [ControlTowerQuantityRobDifferenceListColumns.agreementType]:
    'agreementType_Name',
  [ControlTowerQuantityRobDifferenceListColumns.product]: 'product_Name',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceQuantity]:
    'invoiceQuantity',
  [ControlTowerQuantityRobDifferenceListColumns.price]: 'price',
  [ControlTowerQuantityRobDifferenceListColumns.sumOfCosts]: 'sumOfCosts',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceAmount]: 'invoiceAmount',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceProductAmount]:
    'invoiceProductAmount',
  [ControlTowerQuantityRobDifferenceListColumns.totalInvoiceProductAmount]:
    'totalInvoiceProductAmount',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceCurrency]:
    'invoiceCurrency_Name',
  [ControlTowerQuantityRobDifferenceListColumns.orderProduct]:
    'orderProduct_Name',
  [ControlTowerQuantityRobDifferenceListColumns.confirmedQuantity]:
    'confirmedQuantity',
  [ControlTowerQuantityRobDifferenceListColumns.finalQuantityAmount]:
    'finalQuantityAmount',
  [ControlTowerQuantityRobDifferenceListColumns.orderPrice]: 'orderPrice',
  [ControlTowerQuantityRobDifferenceListColumns.orderPriceCurrency]:
    'orderPriceCurrency_Name',
  [ControlTowerQuantityRobDifferenceListColumns.convertedCurrency]:
    'convertedCurrency_Name',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceProductAmountInOrderCurrency]:
    'invoiceProductAmountInOrderCurrency',
  [ControlTowerQuantityRobDifferenceListColumns.orderCost]: 'orderCost',
  [ControlTowerQuantityRobDifferenceListColumns.orderProductAmount]:
    'orderProductAmount',
  [ControlTowerQuantityRobDifferenceListColumns.totalOrderProductAmount]:
    'totalOrderProductAmount',
  [ControlTowerQuantityRobDifferenceListColumns.orderAmount]: 'orderAmount',
  [ControlTowerQuantityRobDifferenceListColumns.orderCurrency]:
    'orderCurrency_Name',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceStatus]: 'invoiceStatus',
  [ControlTowerQuantityRobDifferenceListColumns.dueDate]: 'dueDate',
  [ControlTowerQuantityRobDifferenceListColumns.workingDueDate]:
    'workingDueDate',
  [ControlTowerQuantityRobDifferenceListColumns.approvedDate]: 'approvedDate',
  [ControlTowerQuantityRobDifferenceListColumns.accountNumber]: 'accountNumber',
  [ControlTowerQuantityRobDifferenceListColumns.paymentDate]: 'paymentDate',
  [ControlTowerQuantityRobDifferenceListColumns.backOfficeComments]:
    'backOfficeComments',
  [ControlTowerQuantityRobDifferenceListColumns.claimNo]: 'claimNo',
  [ControlTowerQuantityRobDifferenceListColumns.claimDate]: 'claimDate',
  [ControlTowerQuantityRobDifferenceListColumns.claimStatus]:
    'claimStatus_Name',
  [ControlTowerQuantityRobDifferenceListColumns.actualSettlementDate]:
    'actualSettlementDate',
  [ControlTowerQuantityRobDifferenceListColumns.debunkerAmount]:
    'debunkerAmount',
  [ControlTowerQuantityRobDifferenceListColumns.resaleAmount]: 'resaleAmount',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceType]:
    'invoiceType_Name',
  [ControlTowerQuantityRobDifferenceListColumns.receivedDate]: 'receivedDate',
  [ControlTowerQuantityRobDifferenceListColumns.sellerDueDate]: 'sellerDueDate',
  [ControlTowerQuantityRobDifferenceListColumns.orderStatus]:
    'orderStatus_Name',
  [ControlTowerQuantityRobDifferenceListColumns.contractId]: 'contractId',
  [ControlTowerQuantityRobDifferenceListColumns.productType]:
    'productType_Name',
  [ControlTowerQuantityRobDifferenceListColumns.fuelPriceItemDescription]:
    'fuelPriceItemDescription',
  [ControlTowerQuantityRobDifferenceListColumns.invoiceApprovalStatus]:
    'invoiceApprovalStatus'
};
