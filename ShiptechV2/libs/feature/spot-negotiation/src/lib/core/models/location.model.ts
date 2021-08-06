export interface LocationModel {
  LocationId: number;
  LocationName: string;
  Latitude: number;
  Longitude: number;
  ROB: LocationProductDetails;
  Comments: Array<CommentModel>;
}

export interface LocationPriceModel {
  LocationId: number;
  LocationName: string;
  ROB: LocationProductDetails;
}
export interface CommentModel {
  Comment: string;
  UserName: string;
  CommentDate: string;
  FileName: string;
  FileBlob?: Array<any>;
  IsActive?: boolean;
}

export interface LocationProductDetails {
  ProductName: string;
  PriceHistory: Array<PriceDetails>;
}

export interface SupplierModel {
  Id: number;
  LocationName: string;
  SupplierName: string;
  IsPhysical: boolean;
  IsTrader: boolean;

  rating: number;
}

export interface PriceDetails {
  PriceDate: Date;
  HSFO: FuelPriceDetails;
  ULSFO: FuelPriceDetails;
  DOGO: FuelPriceDetails;
}

export interface FuelPriceDetails {
  Price: number;
  premium: number;
  discount: number;
  Color: string;
}
