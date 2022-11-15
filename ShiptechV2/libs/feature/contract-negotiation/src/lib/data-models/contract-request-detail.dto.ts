export interface IContractRequestDetailDto {
    id: number;
    startDate: string,
    endDate: string,
    quoteByDate: string,
    minValidity: string,
    supplierComments: string,
    statusId: number,
    createdOn: string,
    createdById: number,
    lastModifiedById: number,
    lastModifiedOn: string,
    quantityDetails: IQuantityDetailDto[],
    contractRequestProducts: IContractRequestProductsDto[]
  }

  export interface IQuantityDetailDto {
    contractualQuantityOptionId: number,
    minDate: string,
    maxDate: string,
    uomId: number,
    tolerancePercentage: number;
  }

  export interface IContractRequestProductsDto {
    id: number,
    contractRequestId: number,
    locationId: number,
    productId: number,
    specGroupId: number,
    minQuantity: number,
    minQuantityUomId: number,
    maxQuantity: number,
    maxQuantityUomId: number,
    pricingTypeId: number,
    pricingComment: string,
    statusId: number,
    createdOn: string,
    createdById: number,
    lastModifiedById: number,
    lastModifiedOn: string,
    allowedProducts: IAllowedProductsDto[],
    allowedLocations: IAllowedLocationsDto[]
  }

  export interface IAllowedProductsDto {
    productId: number,
    specGroupId: number
  }

  export interface IAllowedLocationsDto {
    locationId: number
  }