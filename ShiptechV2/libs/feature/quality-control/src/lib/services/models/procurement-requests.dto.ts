export interface IShiptechProcurementRequestsDto {
  filters: unknown[];
  order: unknown;
  pageFilters: Object;
  pagination: IShiptechPaginationModel,
  searchText: string;
  SortList: Object[];
}

export interface IShiptechPaginationModel {
  skip: number;
  take: number;
}


export interface RequestStatusDto {
  transactionTypeId: number;
  id: number;
  name: string;
  internalName?: any;
  displayName: string;
  code?: any;
  collectionName?: any;
  customNonMandatoryAttribute1?: any;
  isDeleted: boolean;
  modulePathUrl?: any;
  clientIpAddress?: any;
  userAction?: any;
}

export interface ProductStatusDto {
  transactionTypeId: number;
  id: number;
  name: string;
  internalName?: any;
  displayName: string;
  code?: any;
  collectionName?: any;
  customNonMandatoryAttribute1?: any;
  isDeleted: boolean;
  modulePathUrl?: any;
  clientIpAddress?: any;
  userAction?: any;
}

export interface ProductTypeDto {
  id: number;
  name: string;
  internalName?: any;
  displayName?: any;
  code?: any;
  collectionName?: any;
  customNonMandatoryAttribute1?: any;
  isDeleted: boolean;
  modulePathUrl?: any;
  clientIpAddress?: any;
  userAction?: any;
}

export interface IProcurementRequestDto {
  requestId: number;
  requestName: string;
  requestDate: Date;
  requestGroupId?: number;
  createdOn: Date;
  createdById: number;
  createdByName: string;
  lastModifiedOn: Date;
  lastModifiedById: number;
  lastModifiedByName: string;
  buyerId: number;
  buyerName: string;
  requestStatus: RequestStatusDto;
  serviceId: number;
  serviceName: string;
  vesselId: number;
  vesselName: string;
  imo: string;
  eta: Date;
  recentEta?: any;
  etb: Date;
  etd: Date;
  locationId: number;
  locationName: string;
  productId: number;
  productName: string;
  productStatus: ProductStatusDto;
  minQuantity: number;
  maxQuantity: number;
  uomId: number;
  uomName: string;
  specGroupId: number;
  specGroupName: string;
  comments?: any;
  agentCounterpartyId?: number;
  agentName: string;
  currencyId: number;
  currencyName: string;
  deliveryOptionId: number;
  deliveryOptionName: string;
  agreementTypeId: number;
  agreementTypeName: string;
  totalCount: number;
  productTypeId: number;
  productType: ProductTypeDto;
  robOnArrival?: any;
  roundVoyageConsumption?: any;
  modulePathUrl?: any;
  clientIpAddress?: any;
  userAction?: any;
}
