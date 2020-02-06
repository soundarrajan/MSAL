import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export enum InvoiceCompleteListColumns {
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

export enum CompleteListColumnsLabels {
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
  line = 'Service',
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
  invoiceApprovalStatus = 'Invoice Approval Status'
}

/**
 * The map serves the purposes of easily renaming columns on the front-end without affecting back-end filtering/sorting.
 */
export const CompleteListColumnServerKeys: Record<InvoiceCompleteListColumns, string> = {
  [InvoiceCompleteListColumns.order]: 'order',
  [InvoiceCompleteListColumns.orderProductId]: 'orderProductId',
  [InvoiceCompleteListColumns.delivery]: 'delivery',
  [InvoiceCompleteListColumns.invoice]: 'invoice',
  [InvoiceCompleteListColumns.sellerInvoiceNo]: 'sellerInvoiceNo',
  [InvoiceCompleteListColumns.documentNo]: 'documentNo',
  [InvoiceCompleteListColumns.customStatus]: 'customStatus',
  [InvoiceCompleteListColumns.orderProductStatus]: 'orderProductStatus',
  [InvoiceCompleteListColumns.buyer]: 'buyer',

  [InvoiceCompleteListColumns.supplier]: 'supplier',
  [InvoiceCompleteListColumns.orderPhysicalSupplier]: 'orderPhysicalSupplier',
  [InvoiceCompleteListColumns.invoicePhysicalSupplier]: 'invoicePhysicalSupplier',
  [InvoiceCompleteListColumns.vessel]: 'vessel',
  [InvoiceCompleteListColumns.vesselCode]: 'vesselCode',
  [InvoiceCompleteListColumns.carrierCompany]: 'carrierCompany',
  [InvoiceCompleteListColumns.paymentCompany]: 'paymentCompany',
  [InvoiceCompleteListColumns.port]: 'port',
  [InvoiceCompleteListColumns.eta]: 'eta',
  [InvoiceCompleteListColumns.deliveryDate]: 'deliveryDate',
  [InvoiceCompleteListColumns.line]: 'line',
  [InvoiceCompleteListColumns.agreementType]: 'agreementType',
  [InvoiceCompleteListColumns.product]: 'product',
  [InvoiceCompleteListColumns.invoiceQuantity]: 'invoiceQuantity',
  [InvoiceCompleteListColumns.price]: 'price',
  [InvoiceCompleteListColumns.sumOfCosts]: 'sumOfCosts',
  [InvoiceCompleteListColumns.invoiceAmount]: 'invoiceAmount',
  [InvoiceCompleteListColumns.invoiceProductAmount]: 'invoiceProductAmount',
  [InvoiceCompleteListColumns.totalInvoiceProductAmount]: 'totalInvoiceProductAmount',
  [InvoiceCompleteListColumns.invoiceCurrency]: 'invoiceCurrency',
  [InvoiceCompleteListColumns.orderProduct]: 'orderProduct',
  [InvoiceCompleteListColumns.confirmedQuantity]: 'confirmedQuantity',
  [InvoiceCompleteListColumns.finalQuantityAmount]: 'finalQuantityAmount',
  [InvoiceCompleteListColumns.orderPrice]: 'orderPrice',
  [InvoiceCompleteListColumns.orderPriceCurrency]: 'orderPriceCurrency',
  [InvoiceCompleteListColumns.convertedCurrency]: 'convertedCurrency',
  [InvoiceCompleteListColumns.invoiceProductAmountInOrderCurrency]: 'invoiceProductAmountInOrderCurrency',
  [InvoiceCompleteListColumns.orderCost]: 'orderCost',
  [InvoiceCompleteListColumns.orderProductAmount]: 'orderProductAmount',
  [InvoiceCompleteListColumns.totalOrderProductAmount]: 'totalOrderProductAmount',
  [InvoiceCompleteListColumns.orderAmount]: 'orderAmount',
  [InvoiceCompleteListColumns.orderCurrency]: 'orderCurrency',
  [InvoiceCompleteListColumns.dueDate]: 'dueDate',
  [InvoiceCompleteListColumns.workingDueDate]: 'workingDueDate',
  [InvoiceCompleteListColumns.approvedDate]: 'approvedDate',
  [InvoiceCompleteListColumns.accountNumber]: 'accountNumber',
  [InvoiceCompleteListColumns.paymentDate]: 'paymentDate',
  [InvoiceCompleteListColumns.backOfficeComments]: 'backOfficeComments',
  [InvoiceCompleteListColumns.claimNo]: 'claimNo',
  [InvoiceCompleteListColumns.claimDate]: 'claimDate',
  [InvoiceCompleteListColumns.claimStatus]: 'claimStatus',
  [InvoiceCompleteListColumns.actualSettlementDate]: 'actualSettlementDate',
  [InvoiceCompleteListColumns.debunkerAmount]: 'debunkerAmount',
  [InvoiceCompleteListColumns.resaleAmount]: 'resaleAmount',
  [InvoiceCompleteListColumns.invoiceType]: 'invoiceType',
  [InvoiceCompleteListColumns.receivedDate]: 'receivedDate',
  [InvoiceCompleteListColumns.sellerDueDate]: 'sellerDueDate',
  [InvoiceCompleteListColumns.orderStatus]: 'orderStatus',
  [InvoiceCompleteListColumns.contractId]: 'contractId',
  [InvoiceCompleteListColumns.productType]: 'productType',
  [InvoiceCompleteListColumns.fuelPriceItemDescription]: 'fuelPriceItemDescription',
  [InvoiceCompleteListColumns.invoiceApprovalStatus]: 'invoiceApprovalStatus'
};
