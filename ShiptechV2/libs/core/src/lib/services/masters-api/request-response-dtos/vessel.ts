import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IVesselMasterDto extends IDisplayLookupDto {
  averageDailyConsumption: number;
  averageSpeed: number;
  buyer: string;
  charteredVessel: string;
  chartererName: string;
  code: string;
  comments: string;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  deliveryDate: string;
  distillate: IDisplayLookupDto;
  distillateSpecGroup: IDisplayLookupDto;
  earliestRedeliveryDate: string;
  email: string;
  estimatedRedeliveryDate: string;
  expiryDate: string;
  fuel: IDisplayLookupDto;
  fuelSpecGroup: IDisplayLookupDto;
  imoNo: string;
  isFlowMeterAvailable: boolean;
  lab: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
  latestRedeliveryDate: string;
  lsfo: IDisplayLookupDto;
  lsfoSpecsGroup: IDisplayLookupDto;
  mainEngine: string;
  manifoldPressure: number;
  operatingCompany: string;
  pumpingRate: number;
  redeliveryPort: string;
  robDate: string;
  robDoGoDeliveryQuantity: number;
  robDoGoRedeliveryQuantity: number;
  robHsfoDeliveryQuantity: number;
  robHsfoRedeliveryQuantity: number;
  robLsfoDeliveryQuantity: number;
  robLsfoRedeliveryQuantity: number;
  vesselToWatchFlag: boolean;
  service: string;
  teuNominal: number;
  totalCount: number;
  updatedDate: string;
  vesselFlag: string;
  vesselType: string;
  isDeleted?: boolean;
}

export interface IVesselMasterRequest extends IServerGridInfo {}

export interface IVesselMasterResponse {
  items: IVesselMasterDto[];
  totalCount: number;
}
