export interface AdditionalCostViewModel {
  offerId: number;
  requestOfferId?: number | null;
  costType: string;
  costTypeId: number;
  additionalCostId: number;
  costName: string;
  currency: string;
  currencyId: number;
  priceUomId?: number;
  maxQty: number;
  price: number;
  ratePerUom?: number;
  extrasPercentage: number;
  extraAmount? : number;
  totalAmount: number;
  comment: string;
  isAllProductCost: boolean;
  isLocationBased: boolean;
  isDeleted: boolean;
}
