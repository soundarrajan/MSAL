export interface AdditionalCostViewModel {
  id: number;
  offerId?: number | null;
  requestOfferId?: number | null;
  requestLocationId?: number | null;
  costType: string;
  costTypeId: number;
  additionalCostId: number;
  costName: string;
  currency: string;
  currencyId: number;
  priceUomId?: number;
  maxQuantity: number;
  maxQuantityUom: string;
  price: number;
  ratePerUom?: number;
  amount: number;
  extras: number;
  extraAmount? : number;
  totalAmount: number;
  comment: string;
  isAllProductsCost: boolean;
  requestProductId?: number | null;
  isLocationBased: boolean;
  isDeleted: boolean;
  selectedApplicableForId: number | 0;
  locationAdditionalCostId: number | null;
}
