import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import {
  IQcReportDetailsDto,
  IQcReportDetailsProductTypeDto,
  IQcReportDetailsUoms
} from '../api/dto/qc-report-details.dto';
import { IQcVesselResponsesDto } from '../api/dto/qc-vessel-response.dto';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportDetailsProductTypeDto[];
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comment: string;

  constructor(content: IQcReportDetailsDto) {
    Object.assign(this, content);
  }
}
