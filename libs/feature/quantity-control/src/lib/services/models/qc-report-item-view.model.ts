import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IQcReportViewDto, IQcReportViewProductDto, IQcReportViewUoms } from '../api/dto/port-call.dto';

export class QcReportItemViewModel {
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportViewProductDto[];
  uoms: IQcReportViewUoms;

  constructor(content: IQcReportViewDto) {
    Object.assign(this, content);
  }
}
