import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import {
  IQcReportDetailsDto,
  IQcReportDetailsProductDto,
  IQcReportDetailsUoms
} from '../api/dto/qc-report-details.dto';

export class QcReportDetailsModel {
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportDetailsProductDto[];
  uoms: IQcReportDetailsUoms;

  constructor(content: IQcReportDetailsDto) {
    Object.assign(this, content);
  }
}
