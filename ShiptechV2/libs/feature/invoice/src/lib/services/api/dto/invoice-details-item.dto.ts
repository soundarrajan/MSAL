export interface IInvoiceDetailsItemDto {
    sellerInvoiceNo: number;
    documentNo: number;
    invoiceId: number;
    documentType?: IInvoiceDetailsItemBaseInfo;
    canCreateFinalInvoice: boolean;
    receivedDate: Date | string;
    dueDate: Date | string;
    manualDueDate: Date | string;
    accountNumber: number;
    workingDueDate: Date | string;
    sellerInvoiceDate: Date | string;
    sellerDueDate: Date | string;
    approvedDate: Date | string;
    paymentDate: Date | string;
    accountancyDate: Date | string;
    invoiceRateCurrency?: IInvoiceDetailsItemBaseInfo;
    backOfficeComments: any;
	  customStatus: any;
    status?: IInvoiceDetailsItemStatus;
    reconStatus?: IInvoiceDetailsItemStatus;
    deliveryDate: Date | string;
    orderDeliveryDate: Date | string;
    workflowId: string;
    invoiceChecks?: IInvoiceDetailsItemInvoiceCheck[];
    invoiceAmount: number;
	  invoiceTotalPrice: number;
    createdByUser?:  IInvoiceDetailsItemBaseInfo;
    createdAt: Date | string;
    invoiceDate: Date | string;
    lastModifiedByUser?: IInvoiceDetailsItemBaseInfo;
    lastModifiedAt: Date | string;
    relatedInvoices: any;
	  relatedInvoicesSummary: any[];
    orderDetails?: IInvoiceDetailsItemOrderDetails;
    counterpartyDetails: IInvoiceDetailsItemCounterpartyDetails;
    paymentDetails?: IInvoiceDetailsItemPaymentDetails;
    productDetails?: IInvoiceDetailsItemProductDetails[];
    costDetails: any[];
    invoiceClaimDetails: any[];
    invoiceSummary?: IInvoiceDetailsItemInvoiceSummary;
    screenActions?: IInvoiceDetailsItemBaseInfo[];
    requestInfo?: IInvoiceDetailsItemRequestInfo;
    isCreatedFromIntegration: boolean;
    hasManualPaymentDate: boolean;
    attachments: any[],
    customNonMandatoryAttribute1: any;
    customNonMandatoryAttribute2: any;
    customNonMandatoryAttribute3: any;
    customNonMandatoryAttribute4: any;
    customNonMandatoryAttribute5: any;
    customNonMandatoryAttribute6: any;
    customNonMandatoryAttribute7: any;
    customNonMandatoryAttribute8: any;
    customNonMandatoryAttribute9: any;
    name: string;
    id: number;
    isDeleted: boolean;
    modulePathUrl: string;
    clientIpAddress: string;
    userAction: any;
}

export interface IInvoiceDetailsItemStatus extends IInvoiceDetailsItemBaseInfo {
    transactionTypeId: number;
}

export interface IInvoiceDetailsItemInvoiceCheck {
    invoiceId: number;
    isChecked: boolean;
    id: number;
    isDeleted: boolean;
    modulePathUrl: string;
    clientIpAddress: string;
    userAction: any;
}

export interface IInvoiceDetailsItemOrderDetails {
  products: any;
  order: IInvoiceDetailsItemBaseInfo;
  orderDate: Date | string;
  carrierCompany: IInvoiceDetailsItemBaseInfo;
  orderCarrierCompany: IInvoiceDetailsItemBaseInfo;
  paymentCompany: IInvoiceDetailsItemBaseInfo;
  orderPaymentCompany: IInvoiceDetailsItemBaseInfo;
  vesselName: string;
	vesselId: number;
	vesselCode: string;
	portName: string;
	eta: Date | string;
	buyerName: string;
	buyerId: number;
	traderName: string;
	frontOfficeComments: string;
	modulePathUrl: string;
  clientIpAddress: string;
  userAction: any;
}

export interface IInvoiceDetailsItemCounterpartyDetails {
    sellerName?: string;
    payableTo?: IInvoiceDetailsItemBaseInfo;
    counterpartyBankAccount?: IInvoiceDetailsItemBaseInfo;
    brokerName?: string;
    paymentTerm?: IInvoiceDetailsItemBaseInfo;
    orderPaymentTerm?: IInvoiceDetailsItemBaseInfo;
	modulePathUrl?: string;
    clientIpAddress?: string;
    userAction?: any;
}

export interface IInvoiceDetailsItemPaymentDetails {
    paymentStatus: any;
    paidAmount: number;
    paidAmountCurrency: string;
    paymentProofReceived: boolean;
    comments: string;
	  modulePathUrl: string;
    clientIpAddress: string;
    userAction: any;
}

export interface IInvoiceDetailsItemProductDetails {
    invoicedProduct: IInvoiceDetailsItemBaseInfo;
    invoiceQuantity: number;
    invoiceQuantityUom: IInvoiceDetailsItemBaseInfo;
    invoiceRate: number;
    invoiceRateUom: IInvoiceDetailsItemBaseInfo;
    invoiceRateCurrency: IInvoiceDetailsItemBaseInfo;
    invoiceComputedAmount: number;
    orderedProduct: IInvoiceDetailsItemBaseInfo;
    confirmedQuantity: number;
    confirmedQuantityUom: IInvoiceDetailsItemBaseInfo;
    estimatedRate: number;
    currency: IInvoiceDetailsItemBaseInfo;
    estimatedRateUom: IInvoiceDetailsItemBaseInfo;
    estimatedRateCurrency: IInvoiceDetailsItemBaseInfo;
    estimatedAmount: number;
    agreementType: IInvoiceDetailsItemBaseInfo;
    orderProductPricingDate: Date | string;
    deliveryNo: string;
    manualPricingDateOverride: boolean;
    deliveryId: number;
    deliveryProductId: number;
    product: IInvoiceDetailsItemBaseInfo;
    productTypeId: number;
    physicalSupplierCounterparty: IInvoiceDetailsItemBaseInfo;
    deliveryQuantity: number;
    description: string;
    deliveryQuantityUom: IInvoiceDetailsItemBaseInfo;
    sulphurContent: number;
    deliveryMFM: any;
    sellerQuantityTypeId: number;
    difference: number;
    reconStatus: IInvoiceDetailsItemStatus;
    amountInInvoice: number;
    amountInOrder: number;
    pricingDate: Date | string;
    pricingScheduleName: string;
    pricingType: string;
    formulaId: number;
    formulaDescription: string;
    contract: string;
    orderProductId: number
    contractProductId: number;
    sapInvoiceAmount: number;
    invoiceAmount: number;
    id: number
    isDeleted: boolean;
    modulePathUrl: string;
    clientIpAddress: string;
    userAction: any;
}

export interface IInvoiceDetailsItemInvoiceSummary {
    invoiceAmountGrandTotal: number;
    estimatedAmountGrandTotal: number;
    provisionalInvoiceAmount: number;
    totalDifference: number;
    provisionalInvoiceNo: number;
    deductions: number;
    netPayable: number;
    modulePathUrl: string;
    clientIpAddress: string;
    userAction: any;
}

export interface IInvoiceDetailsItemRequestInfo{
    request?: IInvoiceDetailsItemBaseInfo;
    vesselName?: string;
    locationName?: string;
    eta?: Date | string;
    etb?: Date | string;
    modulePathUrl?: string;
    clientIpAddress?: string;
    userAction?: any;
}

export interface IInvoiceDetailsItemBaseInfo {
    id?: number;
    name?: string;
    internalName?: string;
    displayName?: string;
    code?: any;
    collectionName?: string;
    customNonMandatoryAttribute1?: any;
    isDeleted?: boolean;
    modulePathUrl?: string;
    clientIpAddress?: string;
    userAction?: any;
}

export interface IInvoiceDetailsItemResponse extends IInvoiceDetailsItemBaseInfo {
}

export interface IInvoiceDetailsItemRequest {
    Payload: number;
}
export interface INewInvoiceDetailsItemRequest {
    Payload: INewSubInvoiceDetailsItemRequest;
}

export interface INewSubInvoiceDetailsItemRequest {
    DeliveryProductIds: any;
    OrderAdditionalCostIds:any;
    InvoiceTypeName:string;
}

export type InvoiceFormModel<T> = { [P in keyof T]: [T[P], any?] };
