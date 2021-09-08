export interface VesselFilterPreferenceModel {
  FilterId: string;
  FilterName: string;
  TableName: string;
  userName: string;
  TenantId: number;
  IsDefault?: boolean;
  ConditionApplied: VesselFilterDetailModel;
}

export interface VesselFilterDetailModel {
  SelectedFuelStatus?: any;
  FuelType: any;
  VesselType: any;
  RequestStatus: any;
}
