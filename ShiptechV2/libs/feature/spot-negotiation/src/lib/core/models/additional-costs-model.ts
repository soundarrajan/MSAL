import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface AdditionalCostViewModel {
  id: number;
  offerId?: number | null;
  requestOfferId?: number | null;
  requestLocationId?: number | null;
  costType: IDisplayLookupDto;
  costTypeId: number;
  allowedCostTypes: [];
  additionalCost: IDisplayLookupDto;
  additionalCostId: number;
  costName: string;
  currency: any;
  currencyId: number;
  priceUomId?: number;
  maxQuantity: number;
  maxQuantityUom: string;
  maxQtyUomId?: number;
  maxQuantityUomId?: number;
  price: number;
  ratePerUom?: number;
  amount: number;
  extras: number;
  extraAmount?: number;
  totalAmount: number;
  comment: string;
  isAllProductsCost: boolean;
  requestProductId?: number | null;
  isLocationBased: boolean;
  isDeleted?: boolean;
  selectedApplicableForId: number | 0;
  locationAdditionalCostId: number | null;
  requestOfferIds?: any;
  requestProductIds?: any;
}

export interface MasterAdditionalCostViewModel {
  name: string;
  id: number;
  isAllowingNegativeAmmount: boolean;
  costType: IDisplayLookupDto;
}
