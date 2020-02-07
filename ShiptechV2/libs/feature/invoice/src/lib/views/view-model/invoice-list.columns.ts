export enum InvoiceListColumns {
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

export enum InvoiceListColumnsLabels {
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
export const InvoiceListColumnServerKeys: Record<InvoiceListColumns, string> = {
  [InvoiceListColumns.order]: 'order_id',
  [InvoiceListColumns.orderProductId]: 'orderProductId',
  [InvoiceListColumns.delivery]: 'delivery_id',
  [InvoiceListColumns.invoice]: 'invoice_id',
  [InvoiceListColumns.sellerInvoiceNo]: 'sellerInvoiceNo',
  [InvoiceListColumns.documentNo]: 'documentNo',
  [InvoiceListColumns.customStatus]: 'customStatus_DisplayName',
  [InvoiceListColumns.orderProductStatus]: 'orderProductStatus_DisplayName',
  [InvoiceListColumns.buyer]: 'buyer_Name',
  [InvoiceListColumns.supplier]: 'supplier_Name',
  [InvoiceListColumns.orderPhysicalSupplier]: 'orderPhysicalSupplier_Name',
  [InvoiceListColumns.invoicePhysicalSupplier]: 'invoicePhysicalSupplier_Name',
  [InvoiceListColumns.vessel]: 'vessel_Name',
  [InvoiceListColumns.vesselCode]: 'vessel_Code',
  [InvoiceListColumns.carrierCompany]: 'carrierCompany_Name',
  [InvoiceListColumns.paymentCompany]: 'paymentCompany_Name',
  [InvoiceListColumns.port]: 'port_Name',
  [InvoiceListColumns.eta]: 'eta',
  [InvoiceListColumns.deliveryDate]: 'deliveryDate',
  [InvoiceListColumns.line]: 'line_Name',
  [InvoiceListColumns.agreementType]: 'agreementType_Name',
  [InvoiceListColumns.product]: 'product_Name',
  [InvoiceListColumns.invoiceQuantity]: 'invoiceQuantity',
  [InvoiceListColumns.price]: 'price',
  [InvoiceListColumns.sumOfCosts]: 'sumOfCosts',
  [InvoiceListColumns.invoiceAmount]: 'invoiceAmount',
  [InvoiceListColumns.invoiceProductAmount]: 'invoiceProductAmount',
  [InvoiceListColumns.totalInvoiceProductAmount]: 'totalInvoiceProductAmount',
  [InvoiceListColumns.invoiceCurrency]: 'invoiceCurrency_Name',
  [InvoiceListColumns.orderProduct]: 'orderProduct_Name',
  [InvoiceListColumns.confirmedQuantity]: 'confirmedQuantity',
  [InvoiceListColumns.finalQuantityAmount]: 'finalQuantityAmount',
  [InvoiceListColumns.orderPrice]: 'orderPrice',
  [InvoiceListColumns.orderPriceCurrency]: 'orderPriceCurrency_Name',
  [InvoiceListColumns.convertedCurrency]: 'convertedCurrency_Name',
  [InvoiceListColumns.invoiceProductAmountInOrderCurrency]: 'invoiceProductAmountInOrderCurrency',
  [InvoiceListColumns.orderCost]: 'orderCost',
  [InvoiceListColumns.orderProductAmount]: 'orderProductAmount',
  [InvoiceListColumns.totalOrderProductAmount]: 'totalOrderProductAmount',
  [InvoiceListColumns.orderAmount]: 'orderAmount',
  [InvoiceListColumns.orderCurrency]: 'orderCurrency_Name',
  [InvoiceListColumns.invoiceStatus]: 'invoiceStatus',
  [InvoiceListColumns.dueDate]: 'dueDate',
  [InvoiceListColumns.workingDueDate]: 'workingDueDate',
  [InvoiceListColumns.approvedDate]: 'approvedDate',
  [InvoiceListColumns.accountNumber]: 'accountNumber',
  [InvoiceListColumns.paymentDate]: 'paymentDate',
  [InvoiceListColumns.backOfficeComments]: 'backOfficeComments',
  [InvoiceListColumns.claimNo]: 'claimNo',
  [InvoiceListColumns.claimDate]: 'claimDate',
  [InvoiceListColumns.claimStatus]: 'claimStatus_Name',
  [InvoiceListColumns.actualSettlementDate]: 'actualSettlementDate',
  [InvoiceListColumns.debunkerAmount]: 'debunkerAmount',
  [InvoiceListColumns.resaleAmount]: 'resaleAmount',
  [InvoiceListColumns.invoiceType]: 'invoiceType_Name',
  [InvoiceListColumns.receivedDate]: 'receivedDate',
  [InvoiceListColumns.sellerDueDate]: 'sellerDueDate',
  [InvoiceListColumns.orderStatus]: 'orderStatus_Name',
  [InvoiceListColumns.contractId]: 'contractId',
  [InvoiceListColumns.productType]: 'productType_Name',
  [InvoiceListColumns.fuelPriceItemDescription]: 'fuelPriceItemDescription',
  [InvoiceListColumns.invoiceApprovalStatus]: 'invoiceApprovalStatus'
};
