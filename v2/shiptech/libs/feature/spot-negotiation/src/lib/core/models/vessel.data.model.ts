import { CommentModel } from './location.model';

export interface VesselDataModel {
  ShiptechVesselId: number;
  VesselIMONO: number;
  VesselName: string;
  VesselType: string;
  Speed?: number;
  ROB: {
    HSFO: FuelDetails;
    ULSFO: FuelDetails;
    DOGO: FuelDetails;
    Color: String;
    ColorCode: String;
  };
  StandardROB?: {
    HSFO: FuelDetails;
    ULSFO: FuelDetails;
    DOGO: FuelDetails;
    Color: String;
    ColorCode: String;
  };
  EstimatedROB?: {
    HSFO: FuelDetails;
    ULSFO: FuelDetails;
    DOGO: FuelDetails;
    Color: String;
    ColorCode: String;
  };
  MinimumROB?: {
    HSFO: FuelDetails;
    ULSFO: FuelDetails;
    DOGO: FuelDetails;
    Color: String;
    ColorCode: String;
  };
  MaximumROB?: {
    HSFO: FuelDetails;
    ULSFO: FuelDetails;
    DOGO: FuelDetails;
    Color: String;
    ColorCode: String;
  };
  StartLocation: VesselLocation;
  EndLocation: VesselLocation;
  CurrentLocation?: VesselLocation;
  VesselStatus: string;
  Request: RequestDetail;
  LastAction: Date;
  IsSelected?: boolean;
  IsManualSelected?: boolean;
  Comments: Array<CommentModel>;
  CommentsCount: any;
  VoyageCode?: any;
  VoyageDetails: Array<any>;
  VoyageStatus?: any;
}

export interface VesselLocation {
  LocationId: number;
  LocationName: string;
  CountryId?: number;
  Country?: string;
  ETA: Date;
  ETB: Date;
  ETD: Date;
  LatestETA: Date;
  LatestETB: Date;
  LatestETD: Date;
  Latitude: number;
  Longitude: number;
  Schedule: boolean;
  Status: string;
}

export interface VoyageDetails {
  VoyageId: number;
  VesselId: number;
  Function: string;
  LocationId: number;
  LocationName: string;
  ETA: Date;
  ETB: Date;
  ETD: Date;
}
export interface FuelDetails {
  Value: number;
  ColorCode: any;
  Color: string;
}
export interface RequestDetail {
  RequestId: number;
  RequestName: string;
  RequestStatus: any;
  RequestUpdatedOn: any;
}
